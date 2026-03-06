// ALL API Endpoints

export const API = {
    AUTH:{
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        GET_PROFILE: '/api/auth/profile'
    },
    GIFTS:{
        GET_RECOMMENDATIONS: '/api/gifts/recommendations',
        UPDATE_PREFERENCES: '/api/gifts/preferences',
        BASE: '/api/gifts',
        FILTER: '/api/gifts/filter',
        STATS: '/api/gifts/stats',
        BY_ID: (id: string) => `/api/gifts/${id}`,
        RESTORE: (id: string) => `/api/gifts/${id}/restore`,
        PERMANENT_DELETE: (id: string) => `/api/gifts/${id}/permanent`,
    },
    ADMIN_USERS: {
        BASE: '/api/admin/users',
        BY_ID: (id: string) => `/api/admin/users/${id}`,
        RESTORE: (id: string) => `/api/admin/users/${id}/restore`,
        RESET_PASSWORD: (id: string) => `/api/admin/users/${id}/reset-password`,
        TOGGLE_STATUS: (id: string) => `/api/admin/users/${id}/toggle-status`,
        PERMANENT_DELETE: (id: string) => `/api/admin/users/${id}/permanent`,
    },
    USER: {
        UPLOAD_PHOTO: '/api/auth/upload-photo',
        DELETE_PHOTO: '/api/auth/delete-photo',
        UPDATE_PROFILE: '/api/auth'
    },
    UPLOADS: {
        IMAGE: '/api/uploads/image'
    },
    REVIEWS: {
        BASE: '/api/reviews',
        MY: '/api/reviews/my',
        STATS: '/api/reviews/stats',
        GIFT: (giftId: string) => `/api/reviews/gift/${giftId}`,
        BY_ID: (id: string) => `/api/reviews/${id}`,
        STATUS: (id: string) => `/api/reviews/${id}/status`,
    },
}