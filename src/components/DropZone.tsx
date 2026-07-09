import { useState, useCallback } from 'react'
import { SiriLogo } from './SiriLogo'

interface DropZoneProps {
  onFileSelect: (file: File) => void
  isProcessing: boolean
}

export function DropZone({ onFileSelect, isProcessing }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      onFileSelect(file)
    }
  }, [onFileSelect])

  const handleClick = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        onFileSelect(file)
      }
    }
    input.click()
  }, [onFileSelect])

  return (
    <div
      className={`drop-zone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="drop-zone-content">
        {isProcessing ? (
          <>
            <div className="processing-spinner">
              <SiriLogo size="large" />
            </div>
            <h2>AI正在识别题目...</h2>
            <p>正在分析试卷结构，请稍候</p>
            <div className="processing-progress">
              <div className="progress-bar"></div>
            </div>
          </>
        ) : (
          <>
            <div className="drop-icon">
              <SiriLogo size="large" />
            </div>
            <h2>拖拽试卷到此处</h2>
            <p>或点击选择文件</p>
            <div className="drop-hint">
              <span>📄</span>
              <span>支持 JPG、PNG 格式</span>
            </div>
          </>
        )}
      </div>

      <style>{`
        .drop-zone {
          width: 100%;
          height: 100%;
          min-height: 500px;
          border: 3px dashed #E7ECEF;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #FCFDFD;
        }

        .drop-zone:hover:not(.processing) {
          border-color: #CFEFEF;
          background: #F2FCFC;
        }

        .drop-zone.dragging {
          border-color: #06B2B5;
          background: #F2FCFC;
          transform: scale(1.02);
          box-shadow: 0 0 40px rgba(6, 178, 181, 0.15);
        }

        .drop-zone.processing {
          border-color: #CFEFEF;
          background: #F8FAFB;
          cursor: not-allowed;
        }

        .drop-zone-content {
          text-align: center;
          padding: 2rem;
        }

        .drop-icon {
          margin-bottom: 1.5rem;
          animation: drop-icon-float 3s ease-in-out infinite;
        }

        @keyframes drop-icon-float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .drop-zone-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1F2937;
          margin-bottom: 0.5rem;
        }

        .drop-zone-content p {
          color: #6B7280;
          font-size: 0.95rem;
        }

        .drop-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
          padding: 0.75rem 1.5rem;
          background: #F2FCFC;
          border-radius: 12px;
          color: #028081;
          font-size: 0.85rem;
          border: 1px solid #CFEFEF;
        }

        .processing-spinner {
          margin-bottom: 1.5rem;
        }

        .processing-progress {
          width: 220px;
          height: 6px;
          background: #E7ECEF;
          border-radius: 3px;
          margin: 1.5rem auto 0;
          overflow: hidden;
        }

        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #06B2B5 0%, #04999C 100%);
          border-radius: 3px;
          animation: progress 2s ease-in-out infinite;
        }

        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        @media (max-width: 640px) {
          .drop-zone {
            min-height: 400px;
            border-width: 2px;
          }

          .drop-zone-content h2 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  )
}