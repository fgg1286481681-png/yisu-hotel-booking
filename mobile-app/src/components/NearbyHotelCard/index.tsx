import React from 'react';
import { View, Text, Image } from '@tarojs/components';

type NearbyHotelCardProps = {
  hotel: {
    id: number | string;
    name: string;
    image: string;
    price: number;
    city: string;
  };
};

const NearbyHotelCard: React.FC<NearbyHotelCardProps> = ({ hotel }) => {
  const randomDistanceKm = Math.floor(Math.random() * 10) + 1;

  return (
    <View className="hotel-card">
      <Image className="hotel-image" src={hotel.image} mode="aspectFill" />
      <View className="hotel-info">
        <Text className="hotel-name" numberOfLines={1}>
          {hotel.name}
        </Text>
        <Text className="hotel-distance">距您 {randomDistanceKm}km</Text>
        <Text className="hotel-location">{hotel.city}</Text>
        <View className="hotel-price">
          <Text className="price-symbol">¥</Text>
          <Text className="price-amount">{hotel.price}</Text>
          <Text className="price-unit">起</Text>
        </View>
      </View>
    </View>
  );
};

export default NearbyHotelCard;

