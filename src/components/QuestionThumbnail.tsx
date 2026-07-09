import { useEffect, useRef } from 'react'

interface QuestionBox {
  x: number
  y: number
  width: number
  height: number
}

interface QuestionThumbnailProps {
  questionId: number
  box: QuestionBox
  imageUrl: string
  isManualEdit: boolean
  filename: string
  onDownload: () => void
}

export function QuestionThumbnail({
  questionId,
  box,
  imageUrl,
  isManualEdit,
  filename,
  onDownload,
}: QuestionThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl || !imageUrl) return

    const tempImg = new Image()
    tempImg.onload = () => {
      const maxWidth = 180
      const maxHeight = 120
      const aspectRatio = box.width / box.height

      let thumbWidth = maxWidth
      let thumbHeight = maxWidth / aspectRatio

      if (thumbHeight > maxHeight) {
        thumbHeight = maxHeight
        thumbWidth = maxHeight * aspectRatio
      }

      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = thumbWidth
      tempCanvas.height = thumbHeight
      const tempCtx = tempCanvas.getContext('2d')

      if (tempCtx) {
        tempCtx.imageSmoothingEnabled = true
        tempCtx.imageSmoothingQuality = 'high'
        tempCtx.drawImage(
          tempImg,
          box.x, box.y, box.width, box.height,
          0, 0, thumbWidth, thumbHeight
        )

        const enhancedCanvas = document.createElement('canvas')
        enhancedCanvas.width = thumbWidth
        enhancedCanvas.height = thumbHeight
        const enhancedCtx = enhancedCanvas.getContext('2d')
        
        if (enhancedCtx) {
          const imageData = tempCtx.getImageData(0, 0, thumbWidth, thumbHeight)
          const data = imageData.data

          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]
            data[i] = gray
            data[i + 1] = gray
            data[i + 2] = gray
          }

          let minVal = 255
          let maxVal = 0
          for (let i = 0; i < data.length; i += 4) {
            minVal = Math.min(minVal, data[i])
            maxVal = Math.max(maxVal, data[i])
          }
          const range = maxVal - minVal || 1
          for (let i = 0; i < data.length; i += 4) {
            const val = ((data[i] - minVal) / range) * 220 + 20
            data[i] = Math.min(255, Math.max(0, val))
            data[i + 1] = data[i]
            data[i + 2] = data[i]
          }

          enhancedCtx.putImageData(imageData, 0, 0)
          canvasEl.width = enhancedCanvas.width
          canvasEl.height = enhancedCanvas.height
          const ctx = canvasEl.getContext('2d')
          if (ctx) {
            ctx.drawImage(enhancedCanvas, 0, 0)
          }
        }
      }
    }
    tempImg.src = imageUrl
  }, [box, imageUrl])

  return (
    <div className="preview-card" onClick={onDownload}>
      <div className="preview-thumbnail">
        <canvas ref={canvasRef} className="thumbnail-canvas" />
        <div className="preview-label">Q{questionId}</div>
        {isManualEdit && <div className="preview-edit-badge">✏️</div>}
      </div>
      <div className="preview-info">
        <span className="preview-name">{filename}</span>
        <span className="preview-size">{box.width} × {box.height}</span>
        <button className="preview-download-btn" onClick={(e) => {
          e.stopPropagation()
          onDownload()
        }}>
          <span>⬇️</span>
        </button>
      </div>
    </div>
  )
}
