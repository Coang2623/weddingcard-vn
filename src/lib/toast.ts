import { toast as sonnerToast, ExternalToast } from 'sonner'

// Hàm tính toán thời gian hiển thị toast dựa trên độ dài (số từ)
const calculateDuration = (msg: string | React.ReactNode) => {
    if (typeof msg === 'string') {
        const words = msg.split(/\s+/).length
        return words < 15 ? 2000 : 5000
    }
    return 4000 // Default if it's a ReactNode
}

// Wrapper bọc lại đối tượng toast của sonner để ghi đè duration mặc định
export const toast = Object.assign(
    (message: string | React.ReactNode, data?: ExternalToast) => {
        return sonnerToast(message, { duration: calculateDuration(message), ...data })
    },
    sonnerToast,
    {
        success: (message: string | React.ReactNode, data?: ExternalToast) => {
            return sonnerToast.success(message, { duration: calculateDuration(message), ...data })
        },
        error: (message: string | React.ReactNode, data?: ExternalToast) => {
            return sonnerToast.error(message, { duration: calculateDuration(message), ...data })
        },
        info: (message: string | React.ReactNode, data?: ExternalToast) => {
            return sonnerToast.info(message, { duration: calculateDuration(message), ...data })
        },
        warning: (message: string | React.ReactNode, data?: ExternalToast) => {
            return sonnerToast.warning(message, { duration: calculateDuration(message), ...data })
        }
    }
)
