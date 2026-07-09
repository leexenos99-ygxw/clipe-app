import { useState, useRef, useEffect, useCallback } from 'react'
import { fabric } from 'fabric'
import axios from 'axios'
import jsPDF from 'jspdf'
import JSZip from 'jszip'
import { DropZone } from './DropZone'
import { ShareModal } from './ShareModal'
import { QuestionThumbnail } from './QuestionThumbnail'
import { API_BASE_URL } from '@/config/api'

interface BoundingBox {
  id: number
  x: number
  y: number
  width: number
  height: number
  origin_bbox?: [number, number, number, number]
  final_bbox?: [number, number, number, number]
  is_manual_edit?: boolean
}

interface Question {
  id: number
  box: BoundingBox
  selected: boolean
  is_manual_edit: boolean
  origin_bbox?: [number, number, number, number]
  final_bbox?: [number, number, number, number]
  filename?: string
}

interface WorkspaceProps {
  onStepChange?: (step: 'upload' | 'detect' | 'edit' | 'export') => void
}

export function Workspace({ onStepChange }: WorkspaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([])
  const [mode, setMode] = useState<'select' | 'draw' | 'merge'>('select')
  const [, setCurrentStep] = useState<'upload' | 'detect' | 'edit' | 'export'>('upload')
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const updateStep = (step: 'upload' | 'detect' | 'edit' | 'export') => {
    setCurrentStep(step)
    onStepChange?.(step)
  }

  const generateFilename = (questionId: number): string => {
    return `Q${questionId}_${Date.now()}.png`
  }

  const [isAnimating, setIsAnimating] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const playPerspectiveAnimation = (params: any, correctedDataUrl: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsAnimating(true)

      const duration = params.duration_ms || 600
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const t = Math.min(elapsed / duration, 1)

        if (t < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
          setImageUrl(correctedDataUrl)
          resolve()
        }
      }

      requestAnimationFrame(animate)
    })
  }

  const handleFileSelect = useCallback(async (file: File) => {
    if (isAnimating) return
    
    setIsProcessing(true)
    updateStep('detect')
    setUploadedFile(file)

    const reader = new FileReader()
    
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string
      setImageUrl(dataUrl)
      
      const formData = new FormData()
      formData.append('image', file)

      try {
        const perspectiveResponse = await axios.post(`${API_BASE_URL}/perspective-animate`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 5000,
        })

        if (perspectiveResponse.data.success && perspectiveResponse.data.corrected_image) {
          const correctedDataUrl = `data:image/jpeg;base64,${perspectiveResponse.data.corrected_image}`
          await playPerspectiveAnimation(perspectiveResponse.data.animation_params, correctedDataUrl)
        }

        const detectFormData = new FormData()
        detectFormData.append('image', file)

        const response = await axios.post(`${API_BASE_URL}/detect`, detectFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 10000,
        })
        const boxes: BoundingBox[] = response.data.boxes || []

        if (!boxes || boxes.length === 0) {
          console.warn('Backend returned empty boxes, using mock detection')
          throw new Error('Empty boxes')
        }

        const newQuestions = boxes.map((box) => ({
          id: box.id,
          box: { ...box },
          selected: false,
          is_manual_edit: box.is_manual_edit || false,
          origin_bbox: box.origin_bbox,
          final_bbox: box.final_bbox,
          filename: generateFilename(box.id),
        }))
        setQuestions(newQuestions)
        setSelectedQuestionIds([])
        updateStep('edit')
      } catch (error) {
        console.warn('Backend not available or returned empty result, using mock detection')
        
        const mockBoxes: BoundingBox[] = [
          { id: 1, x: 60, y: 100, width: 720, height: 200, origin_bbox: [60, 100, 780, 300], final_bbox: [60, 100, 780, 300], is_manual_edit: false },
          { id: 2, x: 60, y: 320, width: 720, height: 220, origin_bbox: [60, 320, 780, 540], final_bbox: [60, 320, 780, 540], is_manual_edit: false },
          { id: 3, x: 60, y: 560, width: 720, height: 240, origin_bbox: [60, 560, 780, 800], final_bbox: [60, 560, 780, 800], is_manual_edit: false },
          { id: 4, x: 60, y: 820, width: 720, height: 200, origin_bbox: [60, 820, 780, 1020], final_bbox: [60, 820, 780, 1020], is_manual_edit: false },
          { id: 5, x: 60, y: 1040, width: 720, height: 260, origin_bbox: [60, 1040, 780, 1300], final_bbox: [60, 1040, 780, 1300], is_manual_edit: false },
        ]

        const newQuestions = mockBoxes.map((box) => ({
          id: box.id,
          box: { ...box },
          selected: false,
          is_manual_edit: false,
          origin_bbox: box.origin_bbox,
          final_bbox: box.final_bbox,
          filename: generateFilename(box.id),
        }))
        setQuestions(newQuestions)
        setSelectedQuestionIds([])
        updateStep('edit')
      } finally {
        setIsProcessing(false)
      }
    }

    reader.readAsDataURL(file)
  }, [isAnimating])

  const canvasScaleRef = useRef(1)
  const imageObjRef = useRef<fabric.Image | null>(null)
  const isDrawingRef = useRef(false)
  const drawStartRef = useRef<{ x: number; y: number } | null>(null)
  const currentDrawingRectRef = useRef<fabric.Rect | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 1000,
      backgroundColor: '#f5f5f5',
      selection: mode === 'select',
    })
    fabricCanvasRef.current = canvas

    fabric.Image.fromURL(imageUrl, (img) => {
      const width = img.width ?? 1000
      const height = img.height ?? 1000
      const scale = Math.min(750 / width, 950 / height)
      canvasScaleRef.current = scale
      img.scale(scale)
      img.set({ left: 25, top: 25 })
      img.data = { isBackground: true }
      imageObjRef.current = img
      canvas.add(img)
      canvas.sendToBack(img)

      if (questions.length > 0) {
        renderQuestionBoxes(canvas, questions, scale)
      }
      canvas.renderAll()
    })

    const handleMouseDown = (e: any) => {
      if (mode !== 'draw') return
      const pointer = canvas.getPointer(e)
      isDrawingRef.current = true
      drawStartRef.current = { x: pointer.x, y: pointer.y }

      currentDrawingRectRef.current = new fabric.Rect({
        left: pointer.x,
        top: pointer.y,
        width: 0,
        height: 0,
        fill: 'rgba(6, 178, 181, 0.15)',
        stroke: '#06B2B5',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        hasControls: false,
        hasBorders: false,
      })
      canvas.add(currentDrawingRectRef.current)
    }

    const handleMouseMove = (e: any) => {
      if (!isDrawingRef.current || !drawStartRef.current || !currentDrawingRectRef.current) return
      const pointer = canvas.getPointer(e)

      const width = Math.abs(pointer.x - drawStartRef.current.x)
      const height = Math.abs(pointer.y - drawStartRef.current.y)
      const left = Math.min(pointer.x, drawStartRef.current.x)
      const top = Math.min(pointer.y, drawStartRef.current.y)

      currentDrawingRectRef.current.set({
        left,
        top,
        width,
        height,
      })
      canvas.renderAll()
    }

    const handleMouseUp = () => {
      if (!isDrawingRef.current || !drawStartRef.current || !currentDrawingRectRef.current) return
      isDrawingRef.current = false

      const rect = currentDrawingRectRef.current
      const width = rect.width ?? 0
      const height = rect.height ?? 0

      if (width > 20 && height > 20) {
        const imgLeft = 25
        const imgTop = 25
        const imgScale = canvasScaleRef.current

        const newX = Math.max(0, (rect.left || 0) - imgLeft) / imgScale
        const newY = Math.max(0, (rect.top || 0) - imgTop) / imgScale
        const newWidth = width / imgScale
        const newHeight = height / imgScale

        const newQuestionId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1

        const newQuestion: Question = {
          id: newQuestionId,
          box: {
            id: newQuestionId,
            x: Math.round(newX),
            y: Math.round(newY),
            width: Math.round(newWidth),
            height: Math.round(newHeight),
          },
          selected: false,
          is_manual_edit: true,
          filename: generateFilename(newQuestionId),
        }

        setQuestions(prev => [...prev, newQuestion])
      }

      canvas.remove(currentDrawingRectRef.current)
      currentDrawingRectRef.current = null
      drawStartRef.current = null
      canvas.renderAll()
    }

    canvas.on('mouse:down', handleMouseDown)
    canvas.on('mouse:move', handleMouseMove)
    canvas.on('mouse:up', handleMouseUp)

    return () => {
      canvas.off('mouse:down', handleMouseDown)
      canvas.off('mouse:move', handleMouseMove)
      canvas.off('mouse:up', handleMouseUp)
      canvas.dispose()
    }
  }, [imageUrl])

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas || questions.length === 0) return

    canvas.getObjects().forEach((obj) => {
      if (obj.type === 'group' && !obj.data?.isBackground) {
        canvas.remove(obj)
      }
    })

    const scale = canvasScaleRef.current
    renderQuestionBoxes(canvas, questions, scale)
    canvas.renderAll()
  }, [questions])

  const renderQuestionBoxes = (canvas: fabric.Canvas, questionsList: Question[], scale: number) => {
    questionsList.forEach((q) => {
      const rectWidth = q.box.width * scale
      const rectHeight = q.box.height * scale

      const rect = new fabric.Rect({
        left: 0,
        top: 0,
        width: rectWidth,
        height: rectHeight,
        fill: 'rgba(6, 178, 181, 0.2)',
        stroke: '#06B2B5',
        strokeWidth: 2,
        selectable: false,
        hasControls: false,
        hasBorders: false,
      })

      const label = new fabric.Text(`Q${q.id}`, {
        left: 5,
        top: 5,
        fontSize: 14,
        fill: '#06B2B5',
        fontWeight: 'bold',
        selectable: false,
      })

      const group = new fabric.Group([rect, label], {
        left: 25 + q.box.x * scale,
        top: 25 + q.box.y * scale,
        selectable: mode === 'select',
        hasControls: true,
        hasBorders: true,
        cornerColor: '#06B2B5',
        cornerStyle: 'circle',
        transparentCorners: false,
        data: { questionId: q.id },
      })

      canvas.add(group)
    })
  }

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return

    const handleSelectionCreated = (e: any) => {
      if (mode !== 'select') return
      const selectedIds = (e.selected || []).map((obj: fabric.Object) => obj.data?.questionId).filter(Boolean)
      setSelectedQuestionIds(selectedIds as number[])
    }

    const handleSelectionUpdated = (e: any) => {
      if (mode !== 'select') return
      const selectedIds = (e.selected || []).map((obj: fabric.Object) => obj.data?.questionId).filter(Boolean)
      setSelectedQuestionIds(selectedIds as number[])
    }

    const handleSelectionCleared = () => {
      setSelectedQuestionIds([])
    }

    const handleObjectModified = (e: any) => {
      const obj = e.target as fabric.Object
      const questionId = obj.data?.questionId
      if (!questionId) return

      const imgLeft = 25
      const imgTop = 25
      const imgScale = canvasScaleRef.current

      const group = obj as fabric.Group

      const groupLeft = group.left || 0
      const groupTop = group.top || 0
      const groupWidth = (group.width || 0) * (group.scaleX || 1)
      const groupHeight = (group.height || 0) * (group.scaleY || 1)

      const newX = Math.max(0, (groupLeft - imgLeft) / imgScale)
      const newY = Math.max(0, (groupTop - imgTop) / imgScale)
      const newWidth = Math.max(10, groupWidth / imgScale)
      const newHeight = Math.max(10, groupHeight / imgScale)

      const x1 = Math.round(newX)
      const y1 = Math.round(newY)
      const x2 = Math.round(newX + newWidth)
      const y2 = Math.round(newY + newHeight)

      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId
            ? {
                ...q,
                box: {
                  ...q.box,
                  x: x1,
                  y: y1,
                  width: Math.round(newWidth),
                  height: Math.round(newHeight),
                },
                origin_bbox: q.origin_bbox || [x1, y1, x2, y2],
                final_bbox: [x1, y1, x2, y2],
                is_manual_edit: true,
              }
            : q
        )
      )
    }

    canvas.on('selection:created', handleSelectionCreated)
    canvas.on('selection:updated', handleSelectionUpdated)
    canvas.on('selection:cleared', handleSelectionCleared)
    canvas.on('object:modified', handleObjectModified)

    return () => {
      canvas.off('selection:created', handleSelectionCreated)
      canvas.off('selection:updated', handleSelectionUpdated)
      canvas.off('selection:cleared', handleSelectionCleared)
      canvas.off('object:modified', handleObjectModified)
    }
  }, [mode])

  useEffect(() => {
    const canvas = fabricCanvasRef.current
    if (!canvas) return
    canvas.selection = mode === 'select'
    canvas.defaultCursor = mode === 'draw' ? 'crosshair' : 'default'
    canvas.getObjects().forEach((obj) => {
      if (obj.type === 'group') {
        obj.selectable = mode === 'select'
        obj.evented = mode === 'select'
      }
    })
    canvas.renderAll()
  }, [mode])

  const handleDelete = useCallback(() => {
    if (selectedQuestionIds.length === 0) return
    setQuestions((prev) => prev.filter((q) => !selectedQuestionIds.includes(q.id)))
    setSelectedQuestionIds([])
  }, [selectedQuestionIds])

  const handleMerge = useCallback(() => {
    if (selectedQuestionIds.length < 2) {
      alert('请选择至少两个题目进行合并')
      return
    }
    const selected = questions.filter((q) => selectedQuestionIds.includes(q.id))
    const minX = Math.min(...selected.map((q) => q.box.x))
    const minY = Math.min(...selected.map((q) => q.box.y))
    const maxX = Math.max(...selected.map((q) => q.box.x + q.box.width))
    const maxY = Math.max(...selected.map((q) => q.box.y + q.box.height))

    const newBox: BoundingBox = {
      id: Math.max(...questions.map((q) => q.id)) + 1,
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    }

    setQuestions((prev) => {
      const remaining = prev.filter((q) => !selectedQuestionIds.includes(q.id))
      return [...remaining, { id: newBox.id, box: newBox, selected: false, is_manual_edit: false, filename: generateFilename(newBox.id) }]
    })
    setSelectedQuestionIds([])
  }, [selectedQuestionIds, questions])

  const handleAddBox = useCallback(() => {
    setMode('draw')
    alert('请在画布上拖动鼠标绘制新的题目框')
  }, [])

  const enhanceImage = (canvas: HTMLCanvasElement, upscale: boolean = true): HTMLCanvasElement => {
    const ctx = canvas.getContext('2d')
    if (!ctx) return canvas

    const scale = upscale ? 2 : 1
    const enhancedCanvas = document.createElement('canvas')
    enhancedCanvas.width = canvas.width * scale
    enhancedCanvas.height = canvas.height * scale
    const enhancedCtx = enhancedCanvas.getContext('2d')
    if (!enhancedCtx) return canvas

    enhancedCtx.imageSmoothingEnabled = true
    enhancedCtx.imageSmoothingQuality = 'high'
    enhancedCtx.drawImage(canvas, 0, 0, enhancedCanvas.width, enhancedCanvas.height)

    const imageData = enhancedCtx.getImageData(0, 0, enhancedCanvas.width, enhancedCanvas.height)
    const data = imageData.data
    const width = enhancedCanvas.width
    const height = enhancedCanvas.height

    const grayscale = () => {
      for (let i = 0; i < data.length; i += 4) {
        const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
        data[i] = gray
        data[i + 1] = gray
        data[i + 2] = gray
      }
    }

    const applyUnsharpMask = (radius: number = 1.5, amount: number = 0.8) => {
      const tempData = new Uint8ClampedArray(data.length)
      tempData.set(data)

      const halfSize = Math.floor(radius)
      const size = halfSize * 2 + 1
      const kernel: number[] = []
      
      let sum = 0
      for (let i = -halfSize; i <= halfSize; i++) {
        for (let j = -halfSize; j <= halfSize; j++) {
          const dist = Math.sqrt(i * i + j * j)
          const val = Math.exp(-(dist * dist) / (2 * radius * radius))
          kernel.push(val)
          sum += val
        }
      }
      
      for (let i = 0; i < kernel.length; i++) {
        kernel[i] /= sum
      }

      for (let y = halfSize; y < height - halfSize; y++) {
        for (let x = halfSize; x < width - halfSize; x++) {
          const idx = (y * width + x) * 4
          let r = 0

          for (let i = -halfSize; i <= halfSize; i++) {
            for (let j = -halfSize; j <= halfSize; j++) {
              const nIdx = ((y + i) * width + (x + j)) * 4
              const weight = kernel[(i + halfSize) * size + (j + halfSize)]
              r += tempData[nIdx] * weight
            }
          }

          const base = tempData[idx]
          const sharpened = base + (base - r) * amount
          data[idx] = Math.min(255, Math.max(0, sharpened))
          data[idx + 1] = Math.min(255, Math.max(0, sharpened))
          data[idx + 2] = Math.min(255, Math.max(0, sharpened))
        }
      }
    }

    const adaptiveContrast = () => {
      let minVal = 255
      let maxVal = 0

      for (let i = 0; i < data.length; i += 4) {
        minVal = Math.min(minVal, data[i])
        maxVal = Math.max(maxVal, data[i])
      }

      const range = maxVal - minVal || 1
      const targetMin = 20
      const targetMax = 240

      for (let i = 0; i < data.length; i += 4) {
        const val = ((data[i] - minVal) / range) * (targetMax - targetMin) + targetMin
        data[i] = Math.min(255, Math.max(0, val))
        data[i + 1] = data[i]
        data[i + 2] = data[i]
      }
    }

    const applyGamma = (gamma: number = 1.05) => {
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.pow(data[i] / 255, gamma) * 255)
        data[i + 1] = data[i]
        data[i + 2] = data[i]
      }
    }

    const enhanceEdges = () => {
      const tempData = new Uint8ClampedArray(data.length)
      tempData.set(data)

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const idx = (y * width + x) * 4
          const up = tempData[((y - 1) * width + x) * 4]
          const down = tempData[((y + 1) * width + x) * 4]
          const left = tempData[(y * width + (x - 1)) * 4]
          const right = tempData[(y * width + (x + 1)) * 4]

          const edge = Math.abs(up - down) + Math.abs(left - right)
          if (edge > 30) {
            const boost = 1 + (edge / 255) * 0.3
            data[idx] = Math.min(255, tempData[idx] * boost)
            data[idx + 1] = data[idx]
            data[idx + 2] = data[idx]
          }
        }
      }
    }

    grayscale()
    applyUnsharpMask(2, 1.0)
    adaptiveContrast()
    applyGamma(1.1)
    enhanceEdges()

    enhancedCtx.putImageData(imageData, 0, 0)
    return enhancedCanvas
  }

  const handleExportSinglePNG = useCallback(async (question: Question) => {
    if (!imageUrl) return

    const img = new Image()
    img.src = imageUrl

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    const cropCanvas = document.createElement('canvas')
    cropCanvas.width = question.box.width
    cropCanvas.height = question.box.height
    const cropCtx = cropCanvas.getContext('2d')
    if (!cropCtx) return

    cropCtx.drawImage(
      img,
      question.box.x, question.box.y, question.box.width, question.box.height,
      0, 0, question.box.width, question.box.height
    )

    const enhancedCanvas = enhanceImage(cropCanvas)
    const dataURL = enhancedCanvas.toDataURL('image/png', 0.95)
    
    const link = document.createElement('a')
    link.download = question.filename || `Q${question.id}_${Date.now()}.png`
    link.href = dataURL
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [imageUrl])

  const handleExportPNG = useCallback(async () => {
    if (!imageUrl || questions.length === 0) {
      alert('请先上传试卷并识别题目')
      return
    }

    setIsProcessing(true)

    const img = new Image()
    img.src = imageUrl

    await new Promise((resolve, reject) => {
      img.onload = resolve
      img.onerror = reject
    })

    const zip = new JSZip()
    const timestamp = Date.now()

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]
      
      const cropCanvas = document.createElement('canvas')
      cropCanvas.width = q.box.width
      cropCanvas.height = q.box.height
      const cropCtx = cropCanvas.getContext('2d')
      if (!cropCtx) continue

      cropCtx.drawImage(
        img,
        q.box.x, q.box.y, q.box.width, q.box.height,
        0, 0, q.box.width, q.box.height
      )

      const enhancedCanvas = enhanceImage(cropCanvas)
      
      const blob = await new Promise<Blob | null>((resolve) => {
        enhancedCanvas.toBlob(resolve, 'image/png', 0.95)
      })
      
      if (blob) {
        const filename = q.filename || `Q${q.id}_${timestamp}.png`
        zip.file(filename, blob)
      }
    }

    const content = await zip.generateAsync({ type: 'blob' })
    
    const link = document.createElement('a')
    link.download = `questions_${timestamp}.zip`
    link.href = URL.createObjectURL(content)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)

    setIsProcessing(false)
    updateStep('export')
  }, [imageUrl, questions])

  const handleExportPDF = useCallback(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: canvas.height > canvas.width ? 'portrait' : 'landscape',
      unit: 'px',
      format: [canvas.width, canvas.height],
    })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height)
    pdf.save(`questions_${Date.now()}.pdf`)
    updateStep('export')
  }, [])

  const handleShare = useCallback(() => {
    setIsShareModalOpen(true)
  }, [])

  const handleSaveToBank = useCallback(() => {
    if (questions.length === 0) {
      alert('请先上传试卷并识别题目')
      return
    }
    const questionData = {
      timestamp: Date.now(),
      questionCount: questions.length,
      questions: questions.map((q) => ({
        id: q.id,
        box: q.box,
        is_manual_edit: q.is_manual_edit,
        filename: q.filename,
      })),
    }
    const existingBank = localStorage.getItem('questionBank')
    const bank = existingBank ? JSON.parse(existingBank) : []
    bank.push(questionData)
    localStorage.setItem('questionBank', JSON.stringify(bank))
    alert(`已保存 ${questions.length} 道题目到题库！`)
  }, [questions])

  const handleReset = useCallback(() => {
    setImageUrl(null)
    setQuestions([])
    setSelectedQuestionIds([])
    setMode('select')
    updateStep('upload')
  }, [])

  const handleReDetect = useCallback(async () => {
    if (!uploadedFile || isProcessing) return
    
    setIsProcessing(true)
    updateStep('detect')

    const formData = new FormData()
    formData.append('image', uploadedFile)

    try {
      const response = await axios.post(`${API_BASE_URL}/detect`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10000,
      })
      const boxes: BoundingBox[] = response.data.boxes || []

      if (!boxes || boxes.length === 0) {
        throw new Error('Empty boxes')
      }

      const newQuestions = boxes.map((box) => ({
        id: box.id,
        box: { ...box },
        selected: false,
        is_manual_edit: box.is_manual_edit || false,
        origin_bbox: box.origin_bbox,
        final_bbox: box.final_bbox,
        filename: generateFilename(box.id),
      }))
      setQuestions(newQuestions)
      setSelectedQuestionIds([])
      updateStep('edit')
    } catch (error) {
      console.warn('Re-detection failed:', error)
      
      const mockBoxes: BoundingBox[] = [
        { id: 1, x: 60, y: 100, width: 720, height: 200, origin_bbox: [60, 100, 780, 300], final_bbox: [60, 100, 780, 300], is_manual_edit: false },
        { id: 2, x: 60, y: 320, width: 720, height: 220, origin_bbox: [60, 320, 780, 540], final_bbox: [60, 320, 780, 540], is_manual_edit: false },
        { id: 3, x: 60, y: 560, width: 720, height: 240, origin_bbox: [60, 560, 780, 800], final_bbox: [60, 560, 780, 800], is_manual_edit: false },
        { id: 4, x: 60, y: 820, width: 720, height: 200, origin_bbox: [60, 820, 780, 1020], final_bbox: [60, 820, 780, 1020], is_manual_edit: false },
        { id: 5, x: 60, y: 1040, width: 720, height: 260, origin_bbox: [60, 1040, 780, 1300], final_bbox: [60, 1040, 780, 1300], is_manual_edit: false },
      ]

      const newQuestions = mockBoxes.map((box) => ({
        id: box.id,
        box: { ...box },
        selected: false,
        is_manual_edit: false,
        origin_bbox: box.origin_bbox,
        final_bbox: box.final_bbox,
        filename: generateFilename(box.id),
      }))
      setQuestions(newQuestions)
      setSelectedQuestionIds([])
      updateStep('edit')
    } finally {
      setIsProcessing(false)
    }
  }, [uploadedFile, isProcessing])

  return (
    <div className="workspace-container">
      <div className={`workspace-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <button className="sidebar-toggle" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
          <span>{isSidebarCollapsed ? '▶' : '◀'}</span>
        </button>

        {!isSidebarCollapsed && (
          <>
            <div className="section-header">
              <h2>工具面板</h2>
              <span className="section-badge">{questions.length} 题</span>
            </div>

            <div className="action-section">
              <button className="primary-btn" onClick={handleReset} disabled={isProcessing}>
                <span>🔄</span>
                <span>重新上传</span>
              </button>
            </div>

            <div className="tool-section">
              <h3>题目管理</h3>
              <div className="tool-grid">
                <button
                  className={`tool-btn ${mode === 'select' ? 'active' : ''}`}
                  onClick={() => setMode('select')}
                >
                  <span className="btn-icon">👆</span>
                  <span className="btn-text">选择</span>
                </button>
                <button
                  className={`tool-btn ${mode === 'draw' ? 'active' : ''}`}
                  onClick={handleAddBox}
                >
                  <span className="btn-icon">➕</span>
                  <span className="btn-text">添加</span>
                </button>
                <button className="tool-btn" onClick={handleDelete} disabled={selectedQuestionIds.length === 0}>
                  <span className="btn-icon">🗑️</span>
                  <span className="btn-text">删除</span>
                </button>
                <button
                  className={`tool-btn ${mode === 'merge' ? 'active' : ''}`}
                  onClick={handleMerge}
                  disabled={selectedQuestionIds.length < 2}
                >
                  <span className="btn-icon">🔗</span>
                  <span className="btn-text">合并</span>
                </button>
              </div>
            </div>

            <div className="tool-section">
              <h3>识别控制</h3>
              <div className="tool-grid">
                <button
                  className="tool-btn primary"
                  onClick={handleReDetect}
                  disabled={!uploadedFile || isProcessing}
                >
                  <span className="btn-icon">🔄</span>
                  <span className="btn-text">重新识别</span>
                </button>
              </div>
            </div>

            <div className="tool-section">
              <h3>导出分享</h3>
              <div className="tool-grid">
                <button className="tool-btn" onClick={handleExportPNG} disabled={questions.length === 0}>
                  <span className="btn-icon">📦</span>
                  <span className="btn-text">批量ZIP</span>
                </button>
                <button className="tool-btn" onClick={handleExportPDF}>
                  <span className="btn-icon">📄</span>
                  <span className="btn-text">PDF</span>
                </button>
                <button className="tool-btn" onClick={handleShare}>
                  <span className="btn-icon">🔗</span>
                  <span className="btn-text">分享</span>
                </button>
                <button className="tool-btn" onClick={handleSaveToBank} disabled={questions.length === 0}>
                  <span className="btn-icon">📚</span>
                  <span className="btn-text">题库</span>
                </button>
              </div>
              <div className="export-hint">
                <span>💡 点击下方预览图可单独下载</span>
              </div>
            </div>

            <div className="info-section">
              <div className="info-card">
                <div className="info-item">
                  <span className="info-value">{questions.length}</span>
                  <span className="info-label">已识别</span>
                </div>
                <div className="info-divider"></div>
                <div className="info-item">
                  <span className="info-value">{selectedQuestionIds.length}</span>
                  <span className="info-label">已选择</span>
                </div>
              </div>
            </div>
          </>
        )}

        {isSidebarCollapsed && (
          <div className="sidebar-icons">
            <button className="sidebar-icon-btn" onClick={handleReset} title="重新上传">
              <span>🔄</span>
            </button>
            <button className={`sidebar-icon-btn ${mode === 'select' ? 'active' : ''}`} onClick={() => setMode('select')} title="选择">
              <span>👆</span>
            </button>
            <button className={`sidebar-icon-btn ${mode === 'draw' ? 'active' : ''}`} onClick={handleAddBox} title="添加">
              <span>➕</span>
            </button>
            <button className="sidebar-icon-btn" onClick={handleDelete} disabled={selectedQuestionIds.length === 0} title="删除">
              <span>🗑️</span>
            </button>
            <button className="sidebar-icon-btn" onClick={handleMerge} disabled={selectedQuestionIds.length < 2} title="合并">
              <span>🔗</span>
            </button>
            <div className="sidebar-divider"></div>
            <button className="sidebar-icon-btn" onClick={handleExportPNG} title="PNG">
              <span>🖼️</span>
            </button>
            <button className="sidebar-icon-btn" onClick={handleExportPDF} title="PDF">
              <span>📄</span>
            </button>
            <button className="sidebar-icon-btn" onClick={handleShare} title="分享">
              <span>🔗</span>
            </button>
            <button className="sidebar-icon-btn" onClick={handleSaveToBank} title="题库">
              <span>📚</span>
            </button>
          </div>
        )}
      </div>

      <div className="workspace-canvas">
        {imageUrl ? (
          <canvas ref={canvasRef} className="question-canvas" />
        ) : (
          <DropZone onFileSelect={handleFileSelect} isProcessing={isProcessing} />
        )}
      </div>

      {imageUrl && questions.length > 0 && (
        <div className="preview-gallery">
          <div className="gallery-header">
            <h3>题目预览</h3>
            <span className="gallery-count">共 {questions.length} 题</span>
          </div>
          <div className="gallery-grid">
            {questions.map((q) => (
              <QuestionThumbnail
                key={q.id}
                questionId={q.id}
                box={q.box}
                imageUrl={imageUrl}
                isManualEdit={q.is_manual_edit}
                filename={q.filename || `Q${q.id}`}
                onDownload={() => handleExportSinglePNG(q)}
              />
            ))}
          </div>
        </div>
      )}

      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />

      <style>{`
        .workspace-container {
          flex: 1;
          display: flex;
          min-height: calc(100vh - 80px);
          padding: 1.5rem;
          gap: 1.5rem;
          position: relative;
          z-index: 1;
          background: #FFFFFF;
        }

        .workspace-sidebar {
          width: 280px;
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.08);
          flex-shrink: 0;
          position: relative;
          z-index: 100;
          transition: width 0.3s ease;
        }

        .workspace-sidebar.collapsed {
          width: 64px;
          padding: 1rem 0.35rem;
        }

        .sidebar-toggle {
          position: absolute;
          right: -14px;
          top: 16px;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          box-shadow: 0 2px 8px rgba(2, 128, 129, 0.06);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.6rem;
          color: #6B7280;
          z-index: 10;
          transition: all 0.2s;
        }

        .sidebar-toggle:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.15);
          color: #06B2B5;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid #EDF2F4;
        }

        .section-header h2 {
          color: #1F2937;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }

        .section-badge {
          background: #F2FCFC;
          padding: 0.2rem 0.65rem;
          border-radius: 10px;
          font-size: 0.7rem;
          color: #028081;
          font-weight: 600;
          border: 1px solid #CFEFEF;
        }

        .action-section {
          margin-top: 0.4rem;
        }

        .primary-btn {
          width: 100%;
          padding: 0.75rem;
          background: #06B2B5;
          color: #FFFFFF;
          border: none;
          border-radius: 12px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.25);
        }

        .primary-btn:hover:not(:disabled) {
          background: #04999C;
          box-shadow: 0 6px 16px rgba(6, 178, 181, 0.35);
          transform: translateY(-1px);
        }

        .primary-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .tool-section {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .tool-section h3 {
          color: #6B7280;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .tool-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.4rem;
        }

        .tool-btn {
          padding: 0.75rem 0.4rem;
          background: #F8FAFB;
          border: 1px solid #E7ECEF;
          border-radius: 10px;
          font-size: 0.85rem;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.35rem;
          transition: all 0.2s;
          color: #4B5563;
        }

        .btn-icon {
          font-size: 1.15rem;
        }

        .btn-text {
          font-weight: 500;
        }

        .tool-btn:hover:not(:disabled) {
          background: #F2FCFC;
          border-color: #CFEFEF;
          color: #028081;
          transform: translateY(-1px);
        }

        .tool-btn.active {
          background: #06B2B5;
          border-color: #06B2B5;
          color: #FFFFFF;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.25);
        }

        .tool-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .tool-btn.primary {
          background: #06B2B5;
          border-color: #06B2B5;
          color: #FFFFFF;
          grid-column: span 2;
        }

        .tool-btn.primary:hover:not(:disabled) {
          background: #04999C;
          border-color: #04999C;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.25);
        }

        .info-section {
          margin-top: auto;
          padding-top: 0.85rem;
          border-top: 1px solid #EDF2F4;
        }

        .info-card {
          background: #F8FAFB;
          border-radius: 12px;
          padding: 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          border: 1px solid #E7ECEF;
        }

        .info-item {
          text-align: center;
        }

        .info-value {
          display: block;
          font-size: 1.6rem;
          font-weight: 700;
          color: #1F2937;
        }

        .info-label {
          font-size: 0.68rem;
          color: #6B7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-divider {
          width: 1px;
          height: 36px;
          background: #E7ECEF;
        }

        .sidebar-icons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding-top: 0.85rem;
        }

        .sidebar-icon-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: #F8FAFB;
          border: 1px solid #E7ECEF;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.1rem;
          transition: all 0.2s;
          color: #6B7280;
        }

        .sidebar-icon-btn:hover:not(:disabled) {
          background: #F2FCFC;
          border-color: #CFEFEF;
          color: #028081;
          transform: scale(1.08);
        }

        .sidebar-icon-btn.active {
          background: #06B2B5;
          border-color: #06B2B5;
          color: #FFFFFF;
        }

        .sidebar-icon-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .sidebar-divider {
          height: 1px;
          background: #E7ECEF;
          width: 80%;
          margin: 0.4rem 0;
        }

        .workspace-canvas {
          flex: 1;
          min-width: 60%;
          background: #F8FAFB;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: auto;
          box-shadow: 0 4px 20px rgba(2, 128, 129, 0.06);
        }

        .question-canvas {
          border-radius: 12px;
          box-shadow: 0 4px 16px rgba(2, 128, 129, 0.08);
        }

        .preview-gallery {
          margin-top: 1rem;
          padding: 1.25rem;
          background: #FCFDFD;
          border: 1px solid #E7ECEF;
          border-radius: 16px;
          position: relative;
          z-index: 50;
          box-shadow: 0 4px 16px rgba(2, 128, 129, 0.06);
        }

        .gallery-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.85rem;
        }

        .gallery-header h3 {
          color: #1F2937;
          font-size: 1.1rem;
          font-weight: 700;
          margin: 0;
        }

        .gallery-count {
          background: #F2FCFC;
          padding: 0.2rem 0.65rem;
          border-radius: 10px;
          font-size: 0.7rem;
          color: #028081;
          font-weight: 600;
          border: 1px solid #CFEFEF;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 0.85rem;
        }

        .preview-card {
          background: #FFFFFF;
          border: 1px solid #E7ECEF;
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.2s;
        }

        .preview-card:hover {
          border-color: #06B2B5;
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(6, 178, 181, 0.12);
        }

        .preview-thumbnail {
          position: relative;
          width: 100%;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: #F8FAFB;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .thumbnail-canvas {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          display: block;
        }

        .preview-label {
          position: absolute;
          top: 6px;
          left: 6px;
          background: #06B2B5;
          color: #FFFFFF;
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 600;
          z-index: 10;
        }

        .preview-edit-badge {
          position: absolute;
          top: 6px;
          right: 6px;
          background: #F5A623;
          color: #FFFFFF;
          padding: 2px 6px;
          border-radius: 6px;
          font-size: 0.65rem;
          z-index: 10;
        }

        .preview-info {
          padding: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .preview-name {
          font-size: 0.7rem;
          color: #4B5563;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }

        .preview-size {
          font-size: 0.65rem;
          color: #6B7280;
        }

        .preview-download-btn {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: #F2FCFC;
          border: 1px solid #CFEFEF;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          transition: all 0.2s;
          color: #028081;
          flex-shrink: 0;
        }

        .preview-download-btn:hover {
          background: #06B2B5;
          border-color: #06B2B5;
          color: #FFFFFF;
        }

        .export-hint {
          margin-top: 0.4rem;
          font-size: 0.72rem;
          color: #6B7280;
          text-align: center;
        }

        @media (max-width: 768px) {
          .workspace-container {
            flex-direction: column;
            padding: 0.5rem;
          }

          .workspace-sidebar {
            width: 100%;
            border-radius: 16px;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
            padding: 1rem;
            gap: 1rem;
          }

          .workspace-sidebar.collapsed {
            width: 100%;
          }

          .section-header {
            width: 100%;
            order: 1;
          }

          .action-section {
            width: 100%;
            order: 2;
          }

          .tool-section {
            flex: 1;
            min-width: 140px;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            padding-left: 1rem;
            order: 3;
          }

          .info-section {
            order: 4;
            padding-top: 0;
            border-top: none;
            border-left: 1px solid rgba(255, 255, 255, 0.1);
            padding-left: 1rem;
          }

          .sidebar-toggle {
            display: none;
          }

          .sidebar-icons {
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.5rem;
          }

          .workspace-canvas {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}