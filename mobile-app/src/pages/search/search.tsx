import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Input, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getHotels, Hotel } from '../../services/unifiedApi';
import './search.css';

// 热搜数据（文案保持不变，但真正搜索会走统一酒店数据）
const hotSearchData = [
  { id: 1, name: '北京', desc: '北京热门商圈与景点' },
  { id: 2, name: '上海', desc: '外滩、陆家嘴热门酒店' },
  { id: 3, name: '广州', desc: '珠江新城与上下九步行街' },
  { id: 4, name: '三亚', desc: '海景度假与亲子酒店' },
  { id: 5, name: '成都', desc: '春熙路与青城山度假' },
  { id: 6, name: '易宿', desc: '易宿品牌全国门店' },
  { id: 7, name: '爱住', desc: '爱住品牌精选与度假' },
];

const SearchPage: React.FC = () => {
  // 状态管理
  const [searchText, setSearchText] = useState('');
  const [currentCity, setCurrentCity] = useState('北京');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 搜索输入框引用
  const searchInputRef = useRef<any>(null);

  // 初始化 - 获取当前城市
  useEffect(() => {
    // 从路由参数获取城市
    const currentPage = Taro.getCurrentPages().pop();
    if (currentPage?.options?.city) {
      try {
        const city = decodeURIComponent(currentPage.options.city);
        setCurrentCity(city);
      } catch {
        setCurrentCity(currentPage.options.city);
      }
    } else {
      // 默认使用北京
      setCurrentCity('北京');
    }

    // 自动聚焦搜索框
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 300);
  }, []);

  // 执行搜索：调用统一API + 本地匹配
  const performSearch = async (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) {
      Taro.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }

    setLoading(true);
    try {
      // 先按当前城市拉取一批酒店数据，再在前端做关键字匹配
      const hotels = await getHotels({ city: currentCity });
      const lower = trimmed.toLowerCase();

      const results = hotels.filter((hotel) => {
        const name = (hotel.name || '').toLowerCase();
        const address = (hotel.address || '').toLowerCase();
        const city = (hotel.city || '').toLowerCase();
        const brand = (hotel as any).brand ? String((hotel as any).brand).toLowerCase() : '';
        return (
          name.includes(lower) ||
          address.includes(lower) ||
          city.includes(lower) ||
          brand.includes(lower)
        );
      });

      setSearchResults(results);
      setShowResults(true);
    } catch (error) {
      console.error('搜索酒店失败:', error);
      Taro.showToast({
        title: '搜索失败，请稍后重试',
        icon: 'none',
        duration: 2000
      });
    } finally {
      setLoading(false);
    }
  };

  // 处理搜索按钮 / 键盘回车
  const handleSearch = () => {
    if (!searchText.trim()) {
      Taro.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    performSearch(searchText);
  };

  // 处理取消
  const handleCancel = () => {
    Taro.navigateBack();
  };

  // 处理热搜点击
  const handleHotSearchClick = (item: any) => {
    setSearchText(item.name);
    // 自动搜索
    performSearch(item.name);
  };

  // 处理推荐酒店点击
  const handleRecommendClick = (hotel: any) => {
    Taro.showToast({
      title: `选择酒店: ${hotel.name}`,
      icon: 'success',
      duration: 2000
    });
    // 实际项目中这里会跳转到酒店详情页
  };

  return (
    <View className="search-page">
      {/* 搜索框 */}
      <View className="search-header">
        <View className="search-container">
          <View className="search-input-wrapper">
            <Text className="search-icon">🔍</Text>
            <Input
              ref={searchInputRef}
              className="search-input"
              placeholder="位置/品牌/酒店"
              placeholderStyle="color: #999;"
              value={searchText}
              onInput={(e) => setSearchText(e.detail.value)}
              onConfirm={handleSearch}
              focus={true}
              confirmType="search"
            />
          </View>
          <View className="cancel-button" onClick={handleCancel}>
            <Text>取消</Text>
          </View>
        </View>
      </View>

      {/* 搜索结果或热搜 */}
      {showResults ? (
        // 搜索结果
        <View>
          {loading ? (
            <View className="empty-state">
              <Text className="empty-icon">⏳</Text>
              <Text className="empty-title">正在搜索中...</Text>
              <Text className="empty-desc">请稍候</Text>
            </View>
          ) : searchResults.length > 0 ? (
              <View className="recommend-section">
                <Text className="recommend-title">搜索结果 ({searchResults.length})</Text>
                <View className="recommend-list">
                  {searchResults.map(hotel => (
                    <View
                      key={hotel.id}
                      className="recommend-item"
                      onClick={() => handleRecommendClick(hotel)}
                    >
                      <View className="recommend-image">
                        <Image
                          src={hotel.image}
                          mode="aspectFill"
                          className="recommend-image-img"
                        />
                      </View>
                      <View className="recommend-info">
                        <Text className="recommend-name">{hotel.name}</Text>
                        <Text className="recommend-location">
                          {hotel.city} · {hotel.address}
                        </Text>
                        <Text className="recommend-price">¥{hotel.price}起</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
          ) : (
            <View className="empty-state">
              <Text className="empty-icon">🔍</Text>
              <Text className="empty-title">未找到相关结果</Text>
              <Text className="empty-desc">请尝试其他关键词搜索</Text>
            </View>
          )}
        </View>
      ) : (
        // 热搜和推荐
        <View>
          {/* 热搜部分 */}
          <View className="hot-search-section">
            <Text className="hot-search-title">
              <Text>{currentCity}</Text>
              <Text className="hot-search-city">热搜</Text>
            </Text>
            <View className="hot-search-list">
              {hotSearchData.map((item, index) => (
                <View
                  key={item.id}
                  className="hot-search-item"
                  onClick={() => handleHotSearchClick(item)}
                >
                  <View className={`hot-search-rank ${index < 3 ? 'top' : ''}`}>
                    <Text>{index + 1}</Text>
                  </View>
                  <View className="hot-search-content">
                    <Text className="hot-search-name">{item.name}</Text>
                    <Text className="hot-search-desc">{item.desc}</Text>
                  </View>
                  <Text className="hot-search-arrow">›</Text>
                </View>
              ))}
            </View>
          </View>

          {/* 推荐酒店部分（占位，暂不渲染具体列表，避免未定义数据导致报错） */}
          <View className="recommend-section">
            <Text className="recommend-title">{currentCity}推荐酒店</Text>
            <View className="recommend-list">
              <View className="empty-state">
                <Text className="empty-icon">✨</Text>
                <Text className="empty-title">试试上面的热搜或自行输入</Text>
                <Text className="empty-desc">搜索“易宿 / 爱住 / 城市名 / 酒店名”即可查看 PC Mock 中的门店</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default SearchPage;
