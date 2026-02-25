/**
 * 数据适配器 - 将PC端API返回的数据转换为移动端期望的格式
 *
 * PC端数据 -> 移动端数据 格式转换
 */

import { Hotel, RoomType } from '../../../shared/api';

/**
 * 将PC端酒店数据转换为移动端格式
 * @param {Object} pcHotel - PC端酒店数据
 * @returns {Hotel}
 */
export function adaptHotelFromPC(pcHotel) {
    if (!pcHotel) return null;

    // 从starLevel提取星级数字
    let starRating = 3; // 默认3星
    if (pcHotel.starLevel) {
        const starMatch = pcHotel.starLevel.match(/(\d+)/);
        if (starMatch) {
            starRating = parseInt(starMatch[1], 10);
        }
    }

    // 处理房型数据
    let roomTypes = [];
    if (pcHotel.roomTypes && Array.isArray(pcHotel.roomTypes)) {
        roomTypes = pcHotel.roomTypes.map(adaptRoomTypeFromPC);
    }

    // 处理设施设施（从附近信息和促销信息中提取关键词）
    const facilities = [];
    if (pcHotel.nearbyHighlights) {
        // 简单提取关键词
        const keywords = ['地铁', '公交', '商圈', '景区', '火车站', '机场'];
        keywords.forEach(kw => {
            if (pcHotel.nearbyHighlights.includes(kw)) {
                facilities.push(kw + '附近');
            }
        });
    }
    // 添加基础WiFi和停车场（默认）
    if (!facilities.includes('WiFi')) facilities.push('免费WiFi');

    return {
        id: pcHotel.id,
        name: pcHotel.name || '',
        address: pcHotel.address || '',
        price: pcHotel.price || 0,
        rating: 4.0, // 默认评分，新酒店暂无评分
        image: pcHotel.image || 'https://via.placeholder.com/800x400?text=Hotel',
        images: pcHotel.images || [pcHotel.image || 'https://via.placeholder.com/800x400?text=Hotel'],
        city: pcHotel.city || '',
        facilities: facilities,
        starRating: starRating,
        distance: Math.round(Math.random() * 10 * 10) / 10, // 模拟距离数据
        roomTypes: roomTypes,
        description: pcHotel.nearbyHighlights || pcHotel.promotionInfo || '',
        phone: pcHotel.phone || ''
    };
}

/**
 * 将PC端房型数据转换为移动端格式
 * @param {Object} pcRoomType - PC端房型数据
 * @returns {RoomType}
 */
export function adaptRoomTypeFromPC(pcRoomType) {
    if (!pcRoomType) return null;

    return {
        id: pcRoomType.id,
        name: pcRoomType.name || '',
        description: pcRoomType.description || '',
        image: pcRoomType.image || pcRoomType.images?.[0] || 'https://via.placeholder.com/400x300?text=Room',
        tags: pcRoomType.tags || [],
        price: pcRoomType.price || 0,
        originalPrice: pcRoomType.originalPrice,
        area: pcRoomType.area,
        bedType: pcRoomType.bedType,
        maxOccupancy: pcRoomType.maxOccupancy || 2,
        breakfastIncluded: pcRoomType.breakfastIncluded || false,
        cancellationPolicy: pcRoomType.cancellationPolicy || ''
    };
}

/**
 * 获取模拟的酒店图片（用于开发阶段）
 * 使用本地占位图服务，避免外部图片404问题
 * @param {number} hotelId
 * @returns {string}
 */
export function getMockHotelImage(hotelId) {
    // 使用picsum.photos作为备选图片服务，比unsplash更稳定
    const images = [
        'https://picsum.photos/seed/hotel1/800/400',
        'https://picsum.photos/seed/hotel2/800/400',
        'https://picsum.photos/seed/hotel3/800/400',
        'https://picsum.photos/seed/hotel4/800/400'
    ];
    return images[hotelId % images.length];
}

/**
 * 获取模拟的房型图片
 * @param {number} roomId
 * @returns {string}
 */
export function getMockRoomImage(roomId) {
    return `https://picsum.photos/seed/room${roomId}/400/300`;
}
