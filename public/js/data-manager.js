/**
 * Data Manager - Quản lý dữ liệu cho website profile
 */

class DataManager {
    constructor() {
        this.profileData = null;
        this.loaded = false;
        this.listeners = [];
    }

    /**
     * Tải dữ liệu profile từ server
     * @returns {Promise} Promise chứa dữ liệu profile
     */
    async loadData() {
        try {
            // Thử tải từ API trước
            const response = await fetch('/api/profile');

            if (!response.ok) {
                throw new Error('API không khả dụng, fallback về file JSON');
            }

            this.profileData = await response.json();
            this.loaded = true;

            // Thông báo cho tất cả listeners rằng dữ liệu đã được tải
            this.notifyListeners();

            return this.profileData;
        } catch (error) {
            console.warn('API không khả dụng, đang tải từ file JSON tĩnh:', error.message);

            // Fallback về file JSON tĩnh
            try {
                const response = await fetch('data/profile.json');

                if (!response.ok) {
                    throw new Error('Không thể tải file profile.json');
                }

                this.profileData = await response.json();
                this.loaded = true;

                // Thông báo cho tất cả listeners rằng dữ liệu đã được tải
                this.notifyListeners();

                return this.profileData;
            } catch (jsonError) {
                console.error('Error loading profile data from JSON file:', jsonError);
                throw jsonError;
            }
        }
    }

    /**
     * Lấy dữ liệu profile đã tải
     * @returns {Object} Dữ liệu profile
     */
    getData() {
        return this.profileData;
    }

    /**
     * Kiểm tra xem dữ liệu đã được tải chưa
     * @returns {Boolean} true nếu đã tải, false nếu chưa
     */
    isLoaded() {
        return this.loaded;
    }

    /**
     * Thêm listener để nhận thông báo khi dữ liệu thay đổi
     * @param {Function} listener Hàm callback để gọi khi dữ liệu thay đổi
     */
    addListener(listener) {
        if (typeof listener === 'function') {
            this.listeners.push(listener);

            // Nếu dữ liệu đã được tải, gọi listener ngay lập tức
            if (this.loaded) {
                listener(this.profileData);
            }
        }
    }

    /**
     * Xóa listener
     * @param {Function} listener Listener cần xóa
     */
    removeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index !== -1) {
            this.listeners.splice(index, 1);
        }
    }

    /**
     * Thông báo cho tất cả listeners rằng dữ liệu đã thay đổi
     */
    notifyListeners() {
        this.listeners.forEach(listener => {
            listener(this.profileData);
        });
    }

    /**
     * Cập nhật dữ liệu trên server
     * @param {String} section Phần cần cập nhật (personal, skills, experience, portfolio)
     * @param {Object} data Dữ liệu mới
     * @returns {Promise} Promise với dữ liệu đã cập nhật
     */
    async updateData(section, data) {
        try {
            const response = await fetch(`/api/profile/${section}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`Không thể cập nhật ${section}`);
            }

            const responseData = await response.json();

            // Cập nhật dữ liệu local
            this.profileData[section] = responseData;

            // Thông báo cho tất cả listeners rằng dữ liệu đã thay đổi
            this.notifyListeners();

            return responseData;
        } catch (error) {
            console.error(`Error updating ${section}:`, error);
            throw error;
        }
    }

    /**
     * Upload hình ảnh lên server
     * @param {File} file File hình ảnh cần upload
     * @returns {Promise} Promise với đường dẫn tới hình ảnh đã upload
     */
    async uploadImage(file) {
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Không thể upload hình ảnh');
            }

            const data = await response.json();
            return data.path;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
}

// Tạo instance duy nhất của DataManager
const dataManager = new DataManager();

// Export để sử dụng trong các file khác
window.dataManager = dataManager;
