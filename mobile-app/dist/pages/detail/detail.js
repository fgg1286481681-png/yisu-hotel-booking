"use strict";
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
const detail = "";
const DetailPage = () => {
  const [hotel, setHotel] = taro.useState(null);
  const [loading, setLoading] = taro.useState(true);
  const [checkInDate, setCheckInDate] = taro.useState("2024-02-20");
  const [checkOutDate, setCheckOutDate] = taro.useState("2024-02-22");
  const [nights, setNights] = taro.useState(2);
  const [roomCount, setRoomCount] = taro.useState(1);
  const [adultCount, setAdultCount] = taro.useState(2);
  const [childCount, setChildCount] = taro.useState(0);
  const [showCalendar, setShowCalendar] = taro.useState(false);
  const [showRoomModal, setShowRoomModal] = taro.useState(false);
  taro.useEffect(() => {
    const currentPage = taro.Taro.getCurrentPages().pop();
    if (currentPage == null ? void 0 : currentPage.options) {
      const params = currentPage.options;
      const hotelId = params.id ? Number(params.id) : 1;
      if (params.checkIn)
        setCheckInDate(params.checkIn);
      if (params.checkOut)
        setCheckOutDate(params.checkOut);
      if (params.roomCount)
        setRoomCount(Number(params.roomCount));
      if (params.adultCount)
        setAdultCount(Number(params.adultCount));
      if (params.childCount)
        setChildCount(Number(params.childCount));
      if (params.checkIn && params.checkOut) {
        const inDate = new Date(params.checkIn);
        const outDate = new Date(params.checkOut);
        const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
        const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
        setNights(diffDays);
      }
      loadHotelData(hotelId);
    } else {
      loadHotelData(1);
    }
  }, []);
  const loadHotelData = (hotelId) => __async(exports, null, function* () {
    setLoading(true);
    try {
      const hotelData = yield common.getHotel(hotelId);
      if (hotelData) {
        setHotel(hotelData);
      } else {
        console.warn(`酒店ID ${hotelId} 不存在，使用默认数据`);
        const defaultHotel = {
          id: hotelId,
          name: `酒店 ${hotelId}`,
          address: "地址信息",
          price: 500,
          rating: 4,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
          images: [
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop"
          ],
          city: "北京",
          facilities: ["免费WiFi", "停车场", "餐厅"],
          starRating: 3,
          distance: 2,
          description: "酒店描述信息",
          phone: "010-12345678",
          roomTypes: [
            {
              id: 1,
              name: "标准大床房",
              description: "舒适的标准大床房",
              image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop",
              tags: ["免费WiFi", "办公桌"],
              price: 500,
              originalPrice: 600,
              area: "25㎡",
              bedType: "大床",
              maxOccupancy: 2,
              breakfastIncluded: false,
              cancellationPolicy: "入住前24小时可免费取消"
            }
          ]
        };
        setHotel(defaultHotel);
      }
    } catch (error) {
      console.error("加载酒店数据失败:", error);
      taro.Taro.showToast({
        title: "加载失败，请重试",
        icon: "none"
      });
    } finally {
      setLoading(false);
    }
  });
  const handleDateSelect = (value) => {
    if (Array.isArray(value)) {
      const [startDate, endDate] = value;
      setCheckInDate(startDate);
      setCheckOutDate(endDate);
      const inDate = new Date(startDate);
      const outDate = new Date(endDate);
      const diffTime = Math.abs(outDate.getTime() - inDate.getTime());
      const diffDays = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      setNights(diffDays);
    }
    setShowCalendar(false);
  };
  const handleRoomCountChange = (delta) => {
    setRoomCount((prev) => Math.max(1, prev + delta));
  };
  const handleAdultCountChange = (delta) => {
    setAdultCount((prev) => Math.max(1, prev + delta));
  };
  const handleChildCountChange = (delta) => {
    setChildCount((prev) => Math.max(0, prev + delta));
  };
  const handleBookClick = () => {
    console.log("预订酒店:", hotel);
    console.log("入住日期:", checkInDate);
    console.log("离店日期:", checkOutDate);
    console.log("房间数:", roomCount);
    console.log("成人:", adultCount);
    console.log("儿童:", childCount);
  };
  if (loading) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "loading-container", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "loading-text", children: "加载中..." }) });
  }
  if (!hotel) {
    return /* @__PURE__ */ taro.jsx(taro.View, { className: "error-container", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "error-text", children: "酒店信息不存在" }) });
  }
  const getStarLabel = (star) => {
    if (!star)
      return "";
    switch (star) {
      case 1:
        return "经济型";
      case 2:
        return "舒适型";
      case 3:
        return "高档型";
      case 4:
        return "豪华型";
      case 5:
        return "五星级";
      default:
        return `${star}星级`;
    }
  };
  return /* @__PURE__ */ taro.jsxs(taro.View, { className: "detail-page", children: [
    /* @__PURE__ */ taro.jsx(
      taro.Swiper,
      {
        className: "hotel-swiper",
        indicatorDots: true,
        indicatorColor: "rgba(255, 255, 255, 0.6)",
        indicatorActiveColor: "#fff",
        autoplay: true,
        circular: true,
        children: hotel.images && hotel.images.length > 0 ? hotel.images.map(
          (image, index) => /* @__PURE__ */ taro.jsx(taro.SwiperItem, { children: /* @__PURE__ */ taro.jsx(taro.Image, { className: "swiper-image", src: image, mode: "aspectFill" }) }, index)
        ) : (
          // 如果没有图片，使用默认图片
          /* @__PURE__ */ taro.jsx(taro.SwiperItem, { children: /* @__PURE__ */ taro.jsx(taro.Image, { className: "swiper-image", src: hotel.image, mode: "aspectFill" }) })
        )
      }
    ),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-info", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-header", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "hotel-name", children: hotel.name }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-rating", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "rating-text", children: hotel.rating }),
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "rating-label", children: "分" })
        ] })
      ] }),
      hotel.starRating && hotel.starRating > 0 && /* @__PURE__ */ taro.jsxs(taro.View, { className: "hotel-star-row", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "star-badge", children: [
          hotel.starRating,
          "星"
        ] }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "star-text", children: getStarLabel(hotel.starRating) })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "hotel-address", children: hotel.address }),
      hotel.description && /* @__PURE__ */ taro.jsx(taro.Text, { className: "hotel-description", children: hotel.description }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "price-section", children: [
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-label", children: "今日价格" }),
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "price-amount", children: [
          "¥",
          hotel.price
        ] }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "price-unit", children: "/晚" })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "facilities-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "酒店设施" }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "facilities-grid", children: hotel.facilities.map(
        (facility, index) => /* @__PURE__ */ taro.jsx(taro.View, { className: "facility-item", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "facility-text", children: facility }) }, index)
      ) })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "calendar-room-banner", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "入住信息" }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "banner-content", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "date-selection", onClick: () => setShowCalendar(true), children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "date-item", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "date-label", children: "入住" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "date-value", children: checkInDate })
          ] }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "date-separator", children: /* @__PURE__ */ taro.jsxs(taro.Text, { className: "separator-text", children: [
            nights,
            "晚"
          ] }) }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "date-item", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "date-label", children: "离店" }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "date-value", children: checkOutDate })
          ] })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-selection", onClick: () => setShowRoomModal(true), children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-label", children: "房间/人数" }),
          /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-value", children: [
            roomCount,
            "间，",
            adultCount + childCount,
            "人"
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-types-section", children: [
      /* @__PURE__ */ taro.jsx(taro.Text, { className: "section-title", children: "房型选择" }),
      hotel.roomTypes && hotel.roomTypes.length > 0 ? /* @__PURE__ */ taro.jsx(taro.View, { className: "room-types-list", children: hotel.roomTypes.map(
        (roomType) => /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-type-card", children: [
          /* @__PURE__ */ taro.jsx(taro.Image, { className: "room-type-image", src: roomType.image, mode: "aspectFill" }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-type-info", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-type-name", children: roomType.name }),
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-type-description", children: roomType.description }),
            /* @__PURE__ */ taro.jsx(taro.View, { className: "room-type-tags", children: roomType.tags.map(
              (tag, index) => /* @__PURE__ */ taro.jsx(taro.View, { className: "room-type-tag", children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "tag-text", children: tag }) }, index)
            ) }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-type-details", children: [
              roomType.area && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-type-detail", children: [
                "面积: ",
                roomType.area
              ] }),
              roomType.bedType && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-type-detail", children: [
                "床型: ",
                roomType.bedType
              ] }),
              roomType.maxOccupancy && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-type-detail", children: [
                "最多入住: ",
                roomType.maxOccupancy,
                "人"
              ] }),
              roomType.breakfastIncluded && /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-type-detail", children: "含早餐" })
            ] }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-type-price", children: [
              roomType.originalPrice && /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-type-original-price", children: [
                "¥",
                roomType.originalPrice
              ] }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-type-current-price", children: [
                "¥",
                roomType.price
              ] }),
              /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-type-price-unit", children: "/晚" })
            ] }),
            roomType.cancellationPolicy && /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-type-cancellation", children: roomType.cancellationPolicy })
          ] })
        ] }, roomType.id)
      ) }) : /* @__PURE__ */ taro.jsx(taro.Text, { className: "placeholder-text", children: "暂无房型信息" })
    ] }),
    /* @__PURE__ */ taro.jsx(
      common.Calendar,
      {
        mode: "range",
        value: [checkInDate, checkOutDate],
        onChange: handleDateSelect,
        visible: showCalendar,
        onClose: () => setShowCalendar(false)
      }
    ),
    showRoomModal && /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-mask", children: [
      /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-overlay", onClick: () => setShowRoomModal(false) }),
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-panel", children: [
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-modal-header", children: [
          /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-modal-title", children: "选择房间和人数" }),
          /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-close", onClick: () => setShowRoomModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "✕" }) })
        ] }),
        /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-controls", children: [
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-control-label", children: "房间数" }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-buttons", children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => handleRoomCountChange(-1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "-" }) }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-control-value", children: [
                roomCount,
                "间"
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => handleRoomCountChange(1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "+" }) })
            ] })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-control-label", children: "成人" }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-buttons", children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => handleAdultCountChange(-1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "-" }) }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-control-value", children: [
                adultCount,
                "人"
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => handleAdultCountChange(1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "+" }) })
            ] })
          ] }),
          /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control", children: [
            /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-control-label", children: "儿童" }),
            /* @__PURE__ */ taro.jsxs(taro.View, { className: "room-control-buttons", children: [
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => handleChildCountChange(-1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "-" }) }),
              /* @__PURE__ */ taro.jsxs(taro.Text, { className: "room-control-value", children: [
                childCount,
                "人"
              ] }),
              /* @__PURE__ */ taro.jsx(taro.View, { className: "room-control-button", onClick: () => handleChildCountChange(1), children: /* @__PURE__ */ taro.jsx(taro.Text, { children: "+" }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-footer", children: /* @__PURE__ */ taro.jsx(taro.View, { className: "room-modal-button confirm", onClick: () => setShowRoomModal(false), children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "room-modal-button-text", children: "确认" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ taro.jsxs(taro.View, { className: "bottom-bar", children: [
      /* @__PURE__ */ taro.jsxs(taro.View, { className: "bottom-price", children: [
        /* @__PURE__ */ taro.jsxs(taro.Text, { className: "bottom-price-label", children: [
          "¥",
          hotel.price
        ] }),
        /* @__PURE__ */ taro.jsx(taro.Text, { className: "bottom-price-unit", children: "/晚起" })
      ] }),
      /* @__PURE__ */ taro.jsx(taro.View, { className: "book-button", onClick: handleBookClick, children: /* @__PURE__ */ taro.jsx(taro.Text, { className: "book-button-text", children: "立即预订" }) })
    ] })
  ] });
};
var config = {
  "navigationBarTitleText": "酒店详情",
  "enableShareAppMessage": true
};
DetailPage.enableShareAppMessage = true;
Page(taro.createPageConfig(DetailPage, "pages/detail/detail", { root: { cn: [] } }, config || {}));
//# sourceMappingURL=detail.js.map
