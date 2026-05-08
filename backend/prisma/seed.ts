import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const placeholderImage = (label: string, size = '800x600') =>
  `https://via.placeholder.com/${size}?text=${encodeURIComponent(label)}`;

async function main() {
  await prisma.order.deleteMany();
  await prisma.roomType.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin123456!', 10);
  const merchantPassword = await bcrypt.hash('Merchant123456!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@yisu.local',
      password: adminPassword,
      displayName: '系统管理员',
      role: 'ADMIN'
    }
  });

  const merchant = await prisma.user.create({
    data: {
      email: 'merchant@yisu.local',
      password: merchantPassword,
      displayName: '默认商家',
      role: 'MERCHANT',
      merchantName: '易宿商家'
    }
  });

  const approvedHotel = await prisma.hotel.create({
    data: {
      name: '易宿国际酒店（上海虹桥店）',
      city: '上海',
      address: '上海市长宁区虹桥路 100 号',
      phone: '021-12345678',
      starLevel: '五星',
      roomType: '大床房 / 双床房',
      price: 620,
      openingDate: '2020-05-01',
      nearbyHighlights: '近地铁和商圈',
      promotionInfo: '周末连住优惠',
      merchantId: merchant.id,
      status: 'APPROVED'
    }
  });

  const pendingHotel = await prisma.hotel.create({
    data: {
      name: '易宿城市精选酒店（北京国贸店）',
      city: '北京',
      address: '北京市朝阳区国贸大厦附近',
      phone: '010-87654321',
      starLevel: '四星',
      roomType: '商务房',
      price: 480,
      openingDate: '2021-09-01',
      nearbyHighlights: '靠近地铁 1 号线',
      promotionInfo: '新店试运营',
      merchantId: merchant.id,
      status: 'PENDING'
    }
  });

  const approvedRoomTypes = [
    {
      hotelId: approvedHotel.id,
      name: '豪华大床房',
      description: '适合商务出行，含基础办公区',
      tagsJson: JSON.stringify(['大床', '含早', '商务']),
      price: 620,
      originalPrice: 760,
      area: '32㎡',
      bedType: '大床',
      maxOccupancy: 2,
      stock: 6,
      breakfastIncluded: true,
      cancellationPolicy: '入住前 24 小时可免费取消',
      image: placeholderImage('豪华大床房'),
      imagesJson: JSON.stringify([placeholderImage('豪华大床房', '800x600')])
    },
    {
      hotelId: approvedHotel.id,
      name: '商务双床房',
      description: '适合同行或家庭短住',
      tagsJson: JSON.stringify(['双床', '商务']),
      price: 680,
      originalPrice: 820,
      area: '35㎡',
      bedType: '双床',
      maxOccupancy: 2,
      stock: 4,
      breakfastIncluded: true,
      cancellationPolicy: '入住前 24 小时可免费取消',
      image: placeholderImage('商务双床房'),
      imagesJson: JSON.stringify([placeholderImage('商务双床房', '800x600')])
    },
    {
      hotelId: pendingHotel.id,
      name: '标准大床房',
      description: '待审核酒店的示例房型',
      tagsJson: JSON.stringify(['大床']),
      price: 480,
      originalPrice: 580,
      area: '28㎡',
      bedType: '大床',
      maxOccupancy: 2,
      stock: 5,
      breakfastIncluded: false,
      cancellationPolicy: '入住前 24 小时可免费取消',
      image: placeholderImage('标准大床房'),
      imagesJson: JSON.stringify([placeholderImage('标准大床房', '800x600')])
    }
  ];

  for (const roomType of approvedRoomTypes) {
    await prisma.roomType.create({ data: roomType });
  }

  const firstApprovedRoomType = await prisma.roomType.findFirst({
    where: { hotelId: approvedHotel.id },
    orderBy: { id: 'asc' }
  });

  if (firstApprovedRoomType) {
    await prisma.order.create({
      data: {
        orderNo: `OD${Date.now()}SEED`,
        hotelId: approvedHotel.id,
        roomTypeId: firstApprovedRoomType.id,
        guestName: '示例游客',
        guestPhone: '13800000000',
        checkInDate: '2026-04-20',
        checkOutDate: '2026-04-22',
        roomCount: 1,
        adultCount: 2,
        childCount: 0,
        nights: 2,
        totalAmount: firstApprovedRoomType.price * 2,
        status: 'PENDING'
      }
    });
  }

  console.log('Seed completed');
  console.log(`Admin account: ${admin.email} / Admin123456!`);
  console.log(`Merchant account: ${merchant.email} / Merchant123456!`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
