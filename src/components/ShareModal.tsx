import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  shareUrl?: string
}

export function ShareModal({ isOpen, onClose, shareUrl = '' }: ShareModalProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl || window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!isOpen) return null

  const currentUrl = shareUrl || `${window.location.origin}/workspace`

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>分享试卷</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="share-qr-section">
            <div className="qr-code">
              <QRCodeSVG value={currentUrl} size={150} level="H" includeMargin={false} />
            </div>
            <p className="qr-label">扫码分享</p>
          </div>

          <div className="share-link-section">
            <div className="link-input-wrapper">
              <input type="text" value={currentUrl} readOnly />
              <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={handleCopyLink}>
                {copied ? '✓ 已复制' : '复制链接'}
              </button>
            </div>
          </div>

          <div className="share-platforms">
            <button className="platform-btn wechat">
              <span className="platform-icon">💬</span>
              <span>微信</span>
            </button>
            <button className="platform-btn qq">
              <span className="platform-icon">🐧</span>
              <span>QQ</span>
            </button>
            <button className="platform-btn qq-space">
              <span className="platform-icon">📢</span>
              <span>QQ空间</span>
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>取消</button>
          <button className="confirm-btn" onClick={onClose}>完成</button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fade-in 0.2s ease;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: #FCFDFD;
          border-radius: 16px;
          width: 90%;
          max-width: 400px;
          overflow: hidden;
          animation: slide-up 0.3s ease;
          border: 1px solid #E7ECEF;
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem;
          border-bottom: 1px solid #EDF2F4;
        }

        .modal-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1F2937;
          margin: 0;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #9CA3AF;
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: #4B5563;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .share-qr-section {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .qr-code {
          display: inline-block;
          padding: 0.5rem;
          background: #FFFFFF;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(2, 128, 129, 0.06);
          margin-bottom: 0.75rem;
        }

        .qr-label {
          color: #6B7280;
          font-size: 0.9rem;
          margin: 0;
        }

        .share-link-section {
          margin-bottom: 1.5rem;
        }

        .link-input-wrapper {
          display: flex;
          gap: 0.5rem;
        }

        .link-input-wrapper input {
          flex: 1;
          padding: 0.75rem;
          border: 1px solid #E7ECEF;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #1F2937;
          background: #FFFFFF;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .copy-btn {
          padding: 0.75rem 1rem;
          background: #06B2B5;
          color: #FFFFFF;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(6, 178, 181, 0.25);
        }

        .copy-btn:hover {
          background: #04999C;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.35);
        }

        .copy-btn.copied {
          background: #22C55E;
          color: white;
        }

        .share-platforms {
          display: flex;
          gap: 0.75rem;
          justify-content: center;
        }

        .platform-btn {
          flex: 1;
          padding: 0.8rem 0.5rem;
          border: 1px solid #E7ECEF;
          border-radius: 10px;
          background: #FFFFFF;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          transition: all 0.2s;
        }

        .platform-btn:hover {
          border-color: #06B2B5;
          background: #F2FCFC;
        }

        .platform-icon {
          font-size: 1.2rem;
        }

        .platform-btn span:last-child {
          font-size: 0.8rem;
          color: #4B5563;
        }

        .platform-btn.wechat:hover {
          border-color: #07c160;
          background: #f0fff4;
        }

        .platform-btn.qq:hover {
          border-color: #12b7f5;
          background: #f0f9ff;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-top: 1px solid #EDF2F4;
        }

        .cancel-btn {
          flex: 1;
          padding: 0.875rem;
          background: #F8FAFB;
          color: #4B5563;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .cancel-btn:hover {
          background: #E7ECEF;
        }

        .confirm-btn {
          flex: 1;
          padding: 0.875rem;
          background: #06B2B5;
          color: #FFFFFF;
          border: none;
          border-radius: 10px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 12px rgba(6, 178, 181, 0.25);
        }

        .confirm-btn:hover {
          background: #04999C;
          box-shadow: 0 6px 16px rgba(6, 178, 181, 0.35);
        }
      `}</style>
    </div>
  )
}