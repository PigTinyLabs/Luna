import { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';

const InstallApp = () => {
  const [isInstallable, setIsInstallable] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | any>(null);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const [isInstalled, setIsInstalled] = useState(true); // Default to true to prevent flash
  const [showIosInstructions, setShowIosInstructions] = useState(false);
  
  const userAgent = window.navigator.userAgent.toLowerCase();
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/;
  const isMobile = mobileRegex.test(userAgent);

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && (window.navigator as any).standalone === true);
    setIsInstalled(isStandalone);

    // Check if iOS Safari
    const isIos = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = /safari/.test(userAgent) && !/chrome|crios|crmo/.test(userAgent);
    if (isIos && isSafari && !isStandalone) {
      setIsIosSafari(true);
    }

    // Listen for beforeinstallprompt for Android/Chrome
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIosSafari) {
      setShowIosInstructions(true);
      return;
    }

    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  // Only show if it's mobile and not installed, and either it's iOS Safari or Android has triggered beforeinstallprompt
  const shouldShow = isMobile && !isInstalled && (isInstallable || isIosSafari);

  if (!shouldShow) return null;

  return (
    <>
      <div className="install-app-banner">
        <div className="install-app-content">
          <div className="install-icon">
            <Download size={20} />
          </div>
          <div className="install-text">
            <h4>Tải ứng dụng Luna</h4>
            <p>Thêm vào màn hình chính để trải nghiệm tốt hơn</p>
          </div>
        </div>
        <button className="install-button" onClick={handleInstallClick}>
          Cài đặt
        </button>
      </div>

      {showIosInstructions && (
        <div className="ios-install-modal" onClick={() => setShowIosInstructions(false)}>
          <div className="ios-install-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowIosInstructions(false)}>
              <X size={20} />
            </button>
            <h3>Cài đặt ứng dụng</h3>
            <p>Làm theo 2 bước sau để cài đặt Luna vào màn hình chính:</p>
            <ol>
              <li>
                Nhấn vào nút chia sẻ <Share size={18} style={{ display: 'inline', margin: '0 4px', verticalAlign: 'text-bottom' }} /> ở thanh công cụ dưới cùng.
              </li>
              <li>
                Cuộn xuống và chọn <strong>"Thêm vào MH chính"</strong> (Add to Home Screen) <PlusSquare size={18} style={{ display: 'inline', margin: '0 4px', verticalAlign: 'text-bottom' }} />.
              </li>
            </ol>
            <button className="got-it-btn" onClick={() => setShowIosInstructions(false)}>
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default InstallApp;
