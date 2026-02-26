"use strict";
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
const taro = require("../../taro.js");
const common = require("../../common.js");
require("../../babelHelpers.js");
const index = "";
const NearbyHotelCard = ({ hotel, onClick }) => {
  const randomDistanceKm = Math.floor(Math.random() * 10) + 1;
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-card", onClick, children: [
    /* @__PURE__ */ taro.jsx(taro.Image, { className: "hotel-image", src: hotel.image, mode: "aspectFill" }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-info", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "hotel-name", numberOfLines: 1, children: hotel.name }),
      /* @__PURE__ */ taro.jsxs(taro.Text, { className: "hotel-distance", children: [
        "距您 ",
        randomDistanceKm,
        "km"
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "hotel-location", children: hotel.city }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-price", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-symbol", children: "¥" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-amount", children: hotel.price }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-unit", children: "起" })
      ] })
    ] })
  ] });
};
const adImages = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop"
];
const accommodationTypes = [
  { id: 1, name: "酒店", icon: "🏨" },
  { id: 2, name: "民宿", icon: "🏡" },
  { id: 3, name: "公寓", icon: "🏢" },
  { id: 4, name: "度假村", icon: "🌴" }
];
const locationRecommendations = [
  { id: 1, name: "故宫", distance: "2.5km", type: "文化古迹" },
  { id: 2, name: "天安门", distance: "3.1km", type: "地标建筑" },
  { id: 3, name: "王府井", distance: "1.8km", type: "商业中心" },
  { id: 4, name: "颐和园", distance: "12km", type: "公园景区" },
  { id: 5, name: "清华大学", distance: "15km", type: "高校" },
  { id: 6, name: "北京大学", distance: "16km", type: "高校" },
  { id: 7, name: "中国人民大学", distance: "14km", type: "高校" },
  { id: 8, name: "国贸中心", distance: "6km", type: "商务区" },
  { id: 9, name: "金融街", distance: "7km", type: "金融区" },
  { id: 10, name: "招商银行国贸支行", distance: "6.5km", type: "银行" },
  { id: 11, name: "建设银行建国门支行", distance: "5.8km", type: "银行" },
  { id: 12, name: "北京站", distance: "4.2km", type: "交通枢纽" },
  { id: 13, name: "北京西站", distance: "10.3km", type: "交通枢纽" },
  { id: 14, name: "首都机场T3航站楼", distance: "28km", type: "机场" }
];
const categoryNavs = [
  { id: 1, name: "口碑榜", icon: "⭐", color: "#ff6b6b" },
  { id: 2, name: "附近热卖", icon: "🔥", color: "#ffa726" },
  { id: 3, name: "超值低价", icon: "💰", color: "#66bb6a" }
];
const domesticCities = ["北京", "上海", "广州", "深圳", "杭州", "成都", "重庆", "武汉", "西安", "南京"];
const foreignCities = ["东京", "首尔", "新加坡", "曼谷", "巴黎", "伦敦", "纽约", "悉尼", "迪拜", "洛杉矶"];
const priceQuickOptions = [
  { label: "¥0-200", value: [0, 200] },
  { label: "¥200-300", value: [200, 300] },
  { label: "¥300-500", value: [300, 500] },
  { label: "¥500以上", value: [500, 600] }
];
const PRICE_MAX = 600;
const IndexPage = () => {
  const [location, setLocation] = taro.useState({ city: "北京", address: "正在定位..." });
  const [isDomestic, setIsDomestic] = taro.useState(true);
  const [selectedType, setSelectedType] = taro.useState(1);
  const [checkInDate, setCheckInDate] = taro.useState("2024-02-20");
  const [checkOutDate, setCheckOutDate] = taro.useState("2024-02-22");
  const [nights, setNights] = taro.useState(2);
  const [priceRange, setPriceRange] = taro.useState([0, 1e3]);
  const [starRating, setStarRating] = taro.useState([]);
  const [nearbyHotels, setNearbyHotels] = taro.useState([]);
  const [isHourlyRoom, setIsHourlyRoom] = taro.useState(false);
  const [roomCount, setRoomCount] = taro.useState(1);
  const [adultCount, setAdultCount] = taro.useState(2);
  const [childCount, setChildCount] = taro.useState(0);
  const [showPriceStarModal, setShowPriceStarModal] = taro.useState(false);
  const [selectedPriceOption, setSelectedPriceOption] = taro.useState(null);
  const [showRoomModal, setShowRoomModal] = taro.useState(false);
  const [showCalendar, setShowCalendar] = taro.useState(false);
  const [calendarMode, setCalendarMode] = taro.useState("range");
  const [showCityModal, setShowCityModal] = taro.useState(false);
  const cities = taro.useMemo(() => isDomestic ? domesticCities : foreignCities, [isDomestic]);
  taro.useEffect(() => {
    getCurrentLocation();
  }, []);
  taro.useEffect(() => {
    const list = isDomestic ? domesticCities : foreignCities;
    if (!list.includes(location.city)) {
      setLocation((prev) => __spreadProps(__spreadValues({}, prev), { city: list[0] || "北京" }));
    }
  }, [isDomestic]);
  taro.useEffect(() => {
    if (isHourlyRoom) {
      setNights(0);
    } else {
      if (!checkOutDate || checkOutDate === checkInDate) {
        const inDate = new Date(checkInDate);
        const outDate = new Date(inDate);
        outDate.setDate(outDate.getDate() + 1);
        const outDateStr = outDate.toISOString().split("T")[0];
        setCheckOutDate(outDateStr);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        setNights(diffDays);
      }
    }
  }, [isHourlyRoom]);
  taro.useEffect(() => {
    const loadNearbyHotels = () => __async(exports, null, function* () {
      try {
        const hotels = yield common.getHotels();
        const filtered = hotels.filter((hotel) => hotel.city === location.city);
        setNearbyHotels(filtered.slice(0, 6));
      } catch (error) {
        console.error("加载附近酒店失败:", error);
      }
    });
    loadNearbyHotels();
  }, [location.city]);
  const getCurrentLocation = () => {
    taro.Taro.getLocation({
      type: "wgs84",
      success: (_res) => {
        setLocation({
          city: "北京",
          address: "北京市朝阳区"
        });
      },
      fail: (err) => {
        console.error("获取位置失败:", err);
        taro.Taro.showToast({
          title: "定位失败，请手动选择城市",
          icon: "none"
        });
      }
    });
  };
  const handleStarRatingChange = (rating) => {
    setStarRating((prev) => {
      if (prev.includes(rating)) {
        return prev.filter((r) => r !== rating);
      } else {
        return [...prev, rating];
      }
    });
  };
  const handleHotelClick = (hotel) => {
    const params = {
      id: hotel.id.toString(),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      roomCount: roomCount.toString(),
      adultCount: adultCount.toString(),
      childCount: childCount.toString()
    };
    taro.Taro.navigateTo({
      url: `/pages/detail/detail?${new taro.URLSearchParams(params).toString()}`
    });
  };
  const handleSearch = () => {
    const params = {
      city: location.city,
      checkIn: checkInDate,
      checkOut: checkOutDate
    };
    if (priceRange[0] !== 0 || priceRange[1] !== 1e3) {
      params.minPrice = priceRange[0];
      if (priceRange[1] < PRICE_MAX) {
        params.maxPrice = priceRange[1];
      }
    }
    if (starRating.length > 0) {
      params.starRating = starRating.join(",");
    }
    const urlParams = new taro.URLSearchParams();
    if (params.city)
      urlParams.set("city", params.city);
    if (params.checkIn)
      urlParams.set("checkIn", params.checkIn);
    if (params.checkOut)
      urlParams.set("checkOut", params.checkOut);
    if (params.minPrice !== void 0)
      urlParams.set("minPrice", String(params.minPrice));
    if (params.maxPrice !== void 0)
      urlParams.set("maxPrice", String(params.maxPrice));
    if (params.starRating)
      urlParams.set("starRating", params.starRating);
    taro.Taro.navigateTo({
      url: `/pages/list/list?${urlParams.toString()}`
    });
  };
  const handleLocationClick = (locationId) => {
    taro.Taro.navigateTo({
      url: `/pages/list/list?nearby=${locationId}`
    });
  };
  const handleCategoryClick = (categoryId) => {
    let url = "/pages/list/list?";
    switch (categoryId) {
      case 1:
        url += "sort=rating";
        break;
      case 2:
        url += "sort=hot";
        break;
      case 3:
        url += "sort=price_low";
        break;
    }
    taro.Taro.navigateTo({ url });
  };
  const handleSearchBoxClick = () => {
    taro.Taro.navigateTo({
      url: "/pages/search/search"
    });
  };
  const handlePromotionClick = () => {
    taro.Taro.showModal({
      title: "优惠信息",
      content: "此优惠仅限在易宿APP内查看和使用，请下载最新版APP享受专属优惠！",
      showCancel: false
    });
  };
  const handlePriceMinChange = (e) => {
    const v = Number(e.detail.value);
    setPriceRange((prev) => [v, prev[1] < v ? v : prev[1]]);
    setSelectedPriceOption(null);
  };
  const handlePriceMaxChange = (e) => {
    const v = Number(e.detail.value);
    setPriceRange((prev) => [prev[0] > v ? v : prev[0], v]);
    setSelectedPriceOption(null);
  };
  const applyQuickPrice = (value, index2) => {
    setPriceRange([value[0], value[1]]);
    setSelectedPriceOption(index2);
  };
  const handleClearPriceStar = () => {
    setPriceRange([0, 1e3]);
    setStarRating([]);
    setSelectedPriceOption(null);
  };
  const handleConfirmPriceStar = () => {
    setShowPriceStarModal(false);
  };
  const handleDateSelect = (value) => {
    if (calendarMode === "range" && Array.isArray(value)) {
      const [startDate, endDate] = value;
      setCheckInDate(startDate);
      setCheckOutDate(endDate);
      const inDate = new Date(startDate);
      const outDate = new Date(endDate);
      const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      setNights(diffDays);
    } else if (calendarMode === "single" && typeof value === "string") {
      setCheckInDate(value);
    }
    setShowCalendar(false);
  };
  const handleOpenCalendar = () => {
    setCalendarMode(isHourlyRoom ? "single" : "range");
    setShowCalendar(true);
  };
  const handleAdClick = (index2) => {
    const hotelIds = [1, 2, 3];
    const hotelId = hotelIds[index2 % hotelIds.length];
    const params = {
      id: hotelId.toString(),
      checkIn: checkInDate,
      checkOut: checkOutDate,
      roomCount: roomCount.toString(),
      adultCount: adultCount.toString(),
      childCount: childCount.toString()
    };
    taro.Taro.navigateTo({
      url: `/pages/detail/detail?${new taro.URLSearchParams(params).toString()}`
    });
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "index-page", children: [
    /* @__PURE__ */ taro.jsxs(taro.ScrollView, { className: "index-scroll", scrollY: true, children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "ad-section", children: /* @__PURE__ */ taro.jsx(
        taro.Swiper,
        {
          className: "ad-swiper",
          indicatorDots: true,
          indicatorColor: "rgba(255, 255, 255, 0.6)",
          indicatorActiveColor: "#fff",
          autoplay: true,
          circular: true,
          children: adImages.map(
            (img, index2) => /* @__PURE__ */ taro.jsx(taro.SwiperItem, { onClick: () => handleAdClick(index2), children: /* @__PURE__ */ taro.jsx(taro.Image, { className: "ad-image", src: img, mode: "aspectFill" }) }, index2)
          )
        }
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "query-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "query-row accommodation-section", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "domestic-foreign", children: [
            /* @__PURE__ */ taro.jsx(taro.View, { className: `tab ${isDomestic ? "active" : ""}`, onClick: () => setIsDomestic(true), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "国内" }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: `tab ${!isDomestic ? "active" : ""}`, onClick: () => setIsDomestic(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "国外" }) })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "type-grid", children: accommodationTypes.map(
            (type) => /* @__PURE__ */ taro.jsx(
              taro.View,
              {
                className: `type-item ${selectedType === type.id ? "selected" : ""}`,
                onClick: () => setSelectedType(type.id),
                children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "type-name", children: type.name })
              },
              type.id
            )
          ) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "query-row location-section", children: [
          /* @__PURE__ */ taro.jsx(taro.View, { className: "city-picker", onClick: () => setShowCityModal(true), children: /* @__PURE__ */ taro.jsxs(taro.View, { className: "picker-content", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "city-name", children: location.city }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "picker-arrow", children: "▼" })
          ] }) }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "search-box", onClick: handleSearchBoxClick, children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "search-icon", children: "🔍" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "search-placeholder", children: "位置/品牌/酒店" })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "gps-button", onClick: getCurrentLocation, children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "gps-icon", children: "📍" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "gps-text", children: "定位" })
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "query-row date-section", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "hourly-tabs", children: [
            /* @__PURE__ */ taro.jsx(taro.View, { className: `hourly-tab ${!isHourlyRoom ? "active" : ""}`, onClick: () => setIsHourlyRoom(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "住宿" }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: `hourly-tab ${isHourlyRoom ? "active" : ""}`, onClick: () => setIsHourlyRoom(true), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "钟点房" }) })
          ] }),
          isHourlyRoom ? /* @__PURE__ */ taro.jsx(taro.View, { className: "date-single", onClick: handleOpenCalendar, children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "date-value", children: checkInDate }) }) : /* @__PURE__ */ taro.jsxs(taro.View, { className: "date-controls", children: [
            /* @__PURE__ */ taro.jsx(taro.View, { className: "date-input", onClick: handleOpenCalendar, children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "date-value", children: checkInDate }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "date-input", onClick: handleOpenCalendar, children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "date-value", children: checkOutDate }) }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "nights-display", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "nights-count", children: nights }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "nights-label", children: "晚" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "query-row guests-price-row", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "guests-block", onClick: () => setShowRoomModal(true), children: [
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "guest-item", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "guest-label", children: "房间" }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "guest-value", children: [
                roomCount,
                "间"
              ] })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "guest-item", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "guest-label", children: "成人" }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "guest-value", children: [
                adultCount,
                "人"
              ] })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "guest-item", children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "guest-label", children: "儿童" }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "guest-value", children: [
                childCount,
                "人"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ taro.jsx(
            taro.View,
            {
              className: `price-star-trigger ${priceRange[0] !== 0 || priceRange[1] !== 1e3 || starRating.length > 0 ? "active" : ""}`,
              onClick: () => setShowPriceStarModal(true),
              children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price-star-placeholder", children: [
                priceRange[0] !== 0 || priceRange[1] !== 1e3 ? priceRange[1] >= PRICE_MAX ? `¥${priceRange[0]}+` : `¥${priceRange[0]}-${priceRange[1]}` : "",
                priceRange[0] !== 0 || priceRange[1] !== 1e3 ? " " : "",
                starRating.length > 0 ? `${starRating.join(",")}星` : "",
                priceRange[0] === 0 && priceRange[1] === 1e3 && starRating.length === 0 ? "价格/星级" : ""
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "query-row recommendation-section", children: /* @__PURE__ */ taro.jsx(taro.ScrollView, { className: "recommendation-scroll", scrollX: true, children: /* @__PURE__ */ taro.jsx(taro.View, { className: "recommendation-scroll-inner", children: locationRecommendations.map(
          (loc) => /* @__PURE__ */ taro.jsx(taro.View, { className: "recommendation-chip", onClick: () => handleLocationClick(loc.id), children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "rec-name", children: loc.name }) }, loc.id)
        ) }) }) }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "query-row search-button-section", children: /* @__PURE__ */ taro.jsx(taro.Button, { className: "search-button", onClick: handleSearch, children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "search-button-text", children: "立即查询" }) }) })
      ] }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "promotion-section", onClick: handlePromotionClick, children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "promotion-title", children: "🎁 专属优惠" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "promotion-desc", children: "点击查看APP专属优惠，限时特惠！" }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "promotion-hint", children: "仅限APP内查看" })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "category-section", children: categoryNavs.map(
        (cat) => /* @__PURE__ */ taro.jsxs(
          taro.View,
          {
            className: "category-item",
            onClick: () => handleCategoryClick(cat.id),
            style: { backgroundColor: cat.color },
            children: [
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "category-icon", children: cat.icon }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "category-name", children: cat.name })
            ]
          },
          cat.id
        )
      ) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotels-section", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "section-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "附近酒店" }),
          /* @__PURE__ */ taro.jsx(
            taro.Text,
            {
              className: "view-all",
              onClick: () => taro.Taro.navigateTo({ url: "/pages/list/list" }),
              children: "查看全部 ›"
            }
          )
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "hotels-grid", children: nearbyHotels.map(
          (hotel) => /* @__PURE__ */ taro.jsx(
            NearbyHotelCard,
            {
              hotel,
              onClick: () => handleHotelClick(hotel)
            },
            hotel.id
          )
        ) })
      ] })
    ] }),
    showPriceStarModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-star-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "price-star-modal-overlay", onClick: () => setShowPriceStarModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-star-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-star-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-star-modal-title", children: "价格 / 星级" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "price-star-modal-close", onClick: () => setShowPriceStarModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-star-modal-body", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-price-block", children: [
            /* @__PURE__ */ taro.jsxs(taro.Text, { className: "modal-price-label", children: [
              "价格区间：¥",
              priceRange[0],
              " - ¥",
              priceRange[1] >= PRICE_MAX ? "500+" : priceRange[1]
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-sliders", children: [
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-slider-row", children: [
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "modal-slider-min", children: [
                  "¥",
                  priceRange[0]
                ] }),
                /* @__PURE__ */ taro.jsx(
                  taro.Slider,
                  {
                    className: "modal-slider",
                    min: 0,
                    max: 500,
                    value: priceRange[0],
                    onChanging: handlePriceMinChange,
                    onChange: handlePriceMinChange,
                    blockSize: 24,
                    backgroundColor: "#f0f0f0",
                    activeColor: "#1890ff"
                  }
                )
              ] }),
              /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-slider-row", children: [
                /* @__PURE__ */ taro.jsxs(taro.Text, { className: "modal-slider-min", children: [
                  "¥",
                  priceRange[1] >= PRICE_MAX ? "500+" : priceRange[1]
                ] }),
                /* @__PURE__ */ taro.jsx(
                  taro.Slider,
                  {
                    className: "modal-slider",
                    min: 1,
                    max: 500,
                    value: priceRange[1],
                    onChanging: handlePriceMaxChange,
                    onChange: handlePriceMaxChange,
                    blockSize: 24,
                    backgroundColor: "#f0f0f0",
                    activeColor: "#1890ff"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-quick-price", children: priceQuickOptions.map(
              (opt, i) => /* @__PURE__ */ taro.jsx(
                taro.View,
                {
                  className: `modal-quick-btn ${selectedPriceOption === i ? "selected" : ""}`,
                  onClick: () => applyQuickPrice([opt.value[0], opt.value[1]], i),
                  children: /* @__PURE__ */ taro.jsx(taro.Text, { children: opt.label })
                },
                i
              )
            ) })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-star-block", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "modal-star-label", children: "星级" }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-star-buttons", children: [2, 3, 4, 5].map(
              (star) => /* @__PURE__ */ taro.jsx(
                taro.View,
                {
                  className: `modal-star-btn ${starRating.includes(star) ? "active" : ""}`,
                  onClick: () => handleStarRatingChange(star),
                  children: /* @__PURE__ */ taro.jsxs(taro.Text, { children: [
                    "⭐ ",
                    star,
                    "星"
                  ] })
                },
                star
              )
            ) })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "modal-button-group", children: [
            /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-button clear-button", onClick: handleClearPriceStar, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "清除" }) }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "modal-button confirm-button", onClick: handleConfirmPriceStar, children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "确定" }) })
          ] })
        ] })
      ] })
    ] }),
    showRoomModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-overlay", onClick: () => setShowRoomModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-modal-title", children: "房间和人数" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-close", onClick: () => setShowRoomModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-body", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-row", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-control-label", children: "房间" }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-buttons", children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setRoomCount(Math.max(1, roomCount - 1)), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "-" }) }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-control-value", children: [
                roomCount,
                "间"
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setRoomCount(roomCount + 1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "+" }) })
            ] })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-row", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-control-label", children: "成人" }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-buttons", children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setAdultCount(Math.max(1, adultCount - 1)), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "-" }) }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-control-value", children: [
                adultCount,
                "人"
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setAdultCount(adultCount + 1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "+" }) })
            ] })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-row", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-control-label", children: "儿童" }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-buttons", children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setChildCount(Math.max(0, childCount - 1)), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "-" }) }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-control-value", children: [
                childCount,
                "人"
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => setChildCount(childCount + 1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "+" }) })
            ] })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-actions", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-button", onClick: () => setShowRoomModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-modal-button-text", children: "确定" }) }) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsx(
      common.Calendar,
      {
        mode: calendarMode,
        value: calendarMode === "range" ? [checkInDate, checkOutDate] : checkInDate,
        onChange: handleDateSelect,
        visible: showCalendar,
        onClose: () => setShowCalendar(false)
      }
    ),
    showCityModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "city-modal-overlay", onClick: () => setShowCityModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "city-modal-title", children: "选择城市" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "city-modal-close", onClick: () => setShowCityModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-modal-body", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "city-modal-tabs", children: [
            /* @__PURE__ */ taro.jsx(
              taro.View,
              {
                className: `city-modal-tab ${isDomestic ? "active" : ""}`,
                onClick: () => setIsDomestic(true),
                children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "国内" })
              }
            ),
            /* @__PURE__ */ taro.jsx(
              taro.View,
              {
                className: `city-modal-tab ${!isDomestic ? "active" : ""}`,
                onClick: () => setIsDomestic(false),
                children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "国外" })
              }
            )
          ] }),
          /* @__PURE__ */ taro.jsx(taro.ScrollView, { className: "city-list-scroll", scrollY: true, children: /* @__PURE__ */ taro.jsx(taro.View, { className: "city-list", children: cities.map(
            (city, index2) => /* @__PURE__ */ taro.jsxs(
              taro.View,
              {
                className: `city-item ${location.city === city ? "selected" : ""}`,
                onClick: () => {
                  setLocation(__spreadProps(__spreadValues({}, location), { city }));
                  setShowCityModal(false);
                },
                children: [
                  /* @__PURE__ */ taro.jsx(taro.Text, { className: `city-item-text ${location.city === city ? "selected" : ""}`, children: city }),
                  location.city === city && /* @__PURE__ */ taro.jsx(taro.Text, { className: "city-item-check", children: "✓" })
                ]
              },
              city
            )
          ) }) })
        ] })
      ] })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "首页"
};
Page(taro.createPageConfig(IndexPage, "pages/index/index", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=index.js.map
