import { Hotel, Order, RoomType, User } from '@prisma/client';

export const placeholderImage = (label: string, size = '800x600') =>
  `https://via.placeholder.com/${size}?text=${encodeURIComponent(label)}`;

export const parseJsonArray = (value: string | null | undefined): string[] => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const sanitizeUser = (user: User) => ({
  id: user.id,
  email: user.email,
  role: user.role.toLowerCase(),
  displayName: user.displayName,
  merchantName: user.merchantName
});

export const formatRoomType = (
  roomType: RoomType,
  extra?: { remainingRooms?: number }
) => ({
  id: roomType.id,
  hotelId: roomType.hotelId,
  name: roomType.name,
  description: roomType.description || '',
  tags: parseJsonArray(roomType.tagsJson),
  price: roomType.price,
  originalPrice: roomType.originalPrice ?? undefined,
  area: roomType.area ?? undefined,
  bedType: roomType.bedType ?? undefined,
  maxOccupancy: roomType.maxOccupancy,
  stock: roomType.stock,
  remainingRooms: extra?.remainingRooms ?? roomType.stock,
  breakfastIncluded: roomType.breakfastIncluded,
  cancellationPolicy: roomType.cancellationPolicy ?? '',
  image: roomType.image || placeholderImage(roomType.name),
  images: parseJsonArray(roomType.imagesJson).length > 0
    ? parseJsonArray(roomType.imagesJson)
    : [placeholderImage(roomType.name)],
  createdAt: roomType.createdAt,
  updatedAt: roomType.updatedAt
});

export const formatHotel = (
  hotel: Hotel & { roomTypes?: RoomType[] }
) => ({
  id: hotel.id,
  name: hotel.name,
  city: hotel.city,
  address: hotel.address,
  phone: hotel.phone || '',
  starLevel: hotel.starLevel,
  roomType: hotel.roomType,
  price: hotel.price,
  openingDate: hotel.openingDate,
  nearbyHighlights: hotel.nearbyHighlights || '',
  promotionInfo: hotel.promotionInfo || '',
  merchantId: hotel.merchantId,
  status: hotel.status.toLowerCase(),
  rejectReason: hotel.rejectReason || '',
  updatedAt: hotel.updatedAt,
  createdAt: hotel.createdAt,
  roomTypes: hotel.roomTypes ? hotel.roomTypes.map((roomType) => formatRoomType(roomType)) : []
});

export const formatOrder = (
  order: Order & {
    hotel?: Hotel | null;
    roomType?: RoomType | null;
  }
) => ({
  id: order.id,
  orderNo: order.orderNo,
  hotelId: order.hotelId,
  roomTypeId: order.roomTypeId,
  guestName: order.guestName,
  guestPhone: order.guestPhone,
  checkInDate: order.checkInDate,
  checkOutDate: order.checkOutDate,
  roomCount: order.roomCount,
  adultCount: order.adultCount,
  childCount: order.childCount,
  nights: order.nights,
  totalAmount: order.totalAmount,
  status: order.status.toLowerCase(),
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  hotel: order.hotel
    ? {
        id: order.hotel.id,
        name: order.hotel.name,
        city: order.hotel.city,
        address: order.hotel.address
      }
    : undefined,
  roomType: order.roomType ? formatRoomType(order.roomType) : undefined
});
