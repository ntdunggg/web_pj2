import { generateTicketId } from '../utils/ticketUtils';
import { SEAT_STATUS, BOOKING_STATUS, ZONES, PAYMENT_METHODS } from '../utils/constants';

// Mock data storage
let mockData = {
  shows: [],
  bookings: [],
  seats: {},
  users: [
    {
      id: '1',
      email: 'customer@test.com',
      password: 'password',
      role: 'customer',
      name: 'Test Customer',
    },
    {
      id: '2',
      email: 'staff@test.com',
      password: 'password',
      role: 'staff',
      name: 'Test Staff',
    },
    {
      id: '3',
      email: 'manager@test.com',
      password: 'password',
      role: 'manager',
      name: 'Test Manager',
    },
  ],
};

// Initialize mock data
const initializeMockData = () => {
  // Create sample shows
  mockData.shows = [
    {
      id: '1',
      name: 'The Phantom of the Opera',
      description: 'A spectacular musical phenomenon that has captivated audiences worldwide.',
      image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
      date: '2026-01-22T19:30:00', // Wednesday
      pricing: {
        zone_a: 100,
        zone_b: 75,
        level_2: 50,
      },
      status: 'active',
    },
    {
      id: '2',
      name: 'Les Misérables',
      description: 'An epic tale of passion, redemption and the fight for freedom.',
      image: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800',
      date: '2026-01-25T20:00:00', // Saturday
      pricing: {
        zone_a: 120,
        zone_b: 90,
        level_2: 60,
      },
      status: 'active',
    },
    {
      id: '3',
      name: 'Hamilton',
      description: 'The story of America then, told by America now.',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      date: '2026-01-29T19:00:00', // Wednesday
      pricing: {
        zone_a: 150,
        zone_b: 110,
        level_2: 80,
      },
      status: 'active',
    },
  ];

  // Initialize seats for each show
  mockData.shows.forEach((show) => {
    mockData.seats[show.id] = {
      zone_a: generateSeats(15, 10),
      zone_b: generateSeats(15, 10),
      level_2: generateSeats(5, 20), // 5 rows x 20 columns
    };
  });

  // Load from localStorage if available
  const stored = localStorage.getItem('mockData');
  if (stored) {
    const parsed = JSON.parse(stored);
    const firstShowId = Object.keys(parsed.seats || {})[0];
    if (firstShowId && parsed.seats[firstShowId].level_2 && parsed.seats[firstShowId].level_2.length !== 100) {
      console.log("Detected old seat config, clearing mock data...");
      localStorage.removeItem('mockData');
    } else {
      mockData = { ...mockData, ...parsed };
    }
  }
};

// Generate seats for a zone
const generateSeats = (rows, cols) => {
  const seats = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      seats.push({
        row,
        col,
        status: SEAT_STATUS.AVAILABLE,
      });
    }
  }
  return seats;
};

// Save mock data to localStorage
const saveMockData = () => {
  localStorage.setItem('mockData', JSON.stringify({
    shows: mockData.shows,
    bookings: mockData.bookings,
    seats: mockData.seats,
  }));
};

// Simulate API delay
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockService = {
  // Initialize
  init: () => {
    initializeMockData();
  },

  // Auth
  login: async (credentials) => {
    await delay();
    const user = mockData.users.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const { password, ...userWithoutPassword } = user;
    
    // Save to localStorage for persistence
    localStorage.setItem('authToken', 'mock-token-' + user.id);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return {
      token: 'mock-token-' + user.id,
      user: userWithoutPassword,
    };
  },

  register: async (userData) => {
    await delay();
    const newUser = {
      id: String(mockData.users.length + 1),
      ...userData,
      role: 'customer',
    };
    mockData.users.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    
    // Save to localStorage for persistence
    localStorage.setItem('authToken', 'mock-token-' + newUser.id);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    
    return {
      token: 'mock-token-' + newUser.id,
      user: userWithoutPassword,
    };
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Shows
  getShows: async () => {
    await delay();
    return mockData.shows;
  },

  getShowById: async (id) => {
    await delay();
    const show = mockData.shows.find((s) => s.id === id);
    if (!show) throw new Error('Show not found');
    return show;
  },

  createShow: async (showData) => {
    await delay();
    const newShow = {
      id: String(mockData.shows.length + 1),
      ...showData,
      status: 'active',
    };
    mockData.shows.push(newShow);
    
    // Initialize seats for the new show
    mockData.seats[newShow.id] = {
      zone_a: generateSeats(15, 10),
      zone_b: generateSeats(15, 10),
      level_2: generateSeats(5, 20), // 5 rows x 20 columns
    };
    
    saveMockData();
    return newShow;
  },

  updateShow: async (id, showData) => {
    await delay();
    const index = mockData.shows.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Show not found');
    mockData.shows[index] = { ...mockData.shows[index], ...showData };
    saveMockData();
    return mockData.shows[index];
  },

  deleteShow: async (id) => {
    await delay();
    mockData.shows = mockData.shows.filter((s) => s.id !== id);
    delete mockData.seats[id];
    saveMockData();
    return { success: true };
  },

  // Seats
  getSeatAvailability: async (showId) => {
    await delay();
    return mockData.seats[showId] || {};
  },

  // Bookings
  createBooking: async (bookingData) => {
    await delay();
    const tickets = bookingData.seats.map((seat) => ({
      id: generateTicketId(),
      ...seat,
    }));

    // All new bookings are PENDING (requires staff confirmation for VNPay/Cash)
    const bookingStatus = BOOKING_STATUS.PENDING;

    const createdAt = new Date().toISOString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const newBooking = {
      id: String(mockData.bookings.length + 1),
      ...bookingData,
      tickets,
      status: bookingStatus,
      createdAt,
      expiresAt,
    };

    mockData.bookings.push(newBooking);

    // Update seat status based on booking status
    bookingData.seats.forEach((seat) => {
      const zoneSeats = mockData.seats[bookingData.showId][seat.zone];
      const seatIndex = zoneSeats.findIndex(
        (s) => s.row === seat.row && s.col === seat.col
      );
      if (seatIndex !== -1) {
        // New bookings are PENDING, so seat is PENDING
        zoneSeats[seatIndex].status = SEAT_STATUS.PENDING;
        zoneSeats[seatIndex].bookingId = newBooking.id; // Track booking for this seat
      }
    });

    saveMockData();
    return newBooking;
  },

  getMyBookings: async (userId) => {
    await delay();
    console.log('getMyBookings called with userId:', userId);
    console.log('All bookings:', mockData.bookings);
    const userBookings = mockData.bookings.filter((b) => b.userId === userId);
    console.log('User bookings:', userBookings);
    return userBookings;
  },

  getAllBookings: async () => {
    await delay();
    return mockData.bookings;
  },

  updateBookingStatus: async (id, status) => {
    await delay();
    const booking = mockData.bookings.find((b) => b.id === id);
    if (!booking) throw new Error('Booking not found');
    
    const oldStatus = booking.status;
    booking.status = status;
    
    // If rejected, release seats back to available
    if (status === BOOKING_STATUS.REJECTED) {
      booking.seats.forEach((seat) => {
        const zoneSeats = mockData.seats[booking.showId][seat.zone];
        const seatIndex = zoneSeats.findIndex(
          (s) => s.row === seat.row && s.col === seat.col
        );
        if (seatIndex !== -1) {
          zoneSeats[seatIndex].status = SEAT_STATUS.AVAILABLE;
          delete zoneSeats[seatIndex].bookingId; // Remove booking reference
        }
      });
    }
    
    // If approved (pending -> success), update seats to sold
    if (status === BOOKING_STATUS.SUCCESS && oldStatus === BOOKING_STATUS.PENDING) {
      booking.seats.forEach((seat) => {
        const zoneSeats = mockData.seats[booking.showId][seat.zone];
        const seatIndex = zoneSeats.findIndex(
          (s) => s.row === seat.row && s.col === seat.col
        );
        if (seatIndex !== -1) {
          zoneSeats[seatIndex].status = SEAT_STATUS.SOLD;
        }
      });
      console.log(`Booking ${id} approved: seats confirmed as sold`);
    }
    
    saveMockData();
    return booking;
  },

  // Reports
  getRevenueReport: async () => {
    await delay();
    const revenueByShow = mockData.shows.map((show) => {
      const showBookings = mockData.bookings.filter(
        (b) => b.showId === show.id && b.status === BOOKING_STATUS.SUCCESS
      );
      const revenue = showBookings.reduce((sum, b) => sum + b.totalAmount, 0);
      return {
        showName: show.name,
        revenue,
        bookings: showBookings.length,
      };
    });

    const paymentMethods = {
      cash: mockData.bookings
        .filter((b) => b.paymentMethod === 'cash' && b.status === BOOKING_STATUS.SUCCESS)
        .reduce((sum, b) => sum + b.totalAmount, 0),
      vnpay: mockData.bookings
        .filter((b) => b.paymentMethod === 'vnpay' && b.status === BOOKING_STATUS.SUCCESS)
        .reduce((sum, b) => sum + b.totalAmount, 0),
    };

    return {
      revenueByShow,
      paymentMethods,
      totalRevenue: paymentMethods.cash + paymentMethods.vnpay,
    };
  },

  getSeatOccupancy: async () => {
    await delay();
    const occupancy = mockData.shows.map((show) => {
      const seats = mockData.seats[show.id];
      const totalSeats = 400;
      const soldSeats = Object.values(seats)
        .flat()
        .filter((s) => s.status === SEAT_STATUS.SOLD).length;
      
      return {
        showName: show.name,
        totalSeats,
        soldSeats,
        availableSeats: totalSeats - soldSeats,
        occupancyRate: ((soldSeats / totalSeats) * 100).toFixed(2),
      };
    });

    return occupancy;
  },

  submitPayment: async ({ bookingId, userId, method, phone, address }) => {
    await delay();
    const booking = mockData.bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error('Booking not found');

    if (method === 'online') {
      booking.status = BOOKING_STATUS.SUCCESS;
      booking.paymentMethod = PAYMENT_METHODS.VNPAY;
      // Update seats to SOLD
      booking.seats.forEach((seat) => {
        const zoneSeats = mockData.seats[booking.showId][seat.zone];
        const seatIndex = zoneSeats.findIndex(
          (s) => s.row === seat.row && s.col === seat.col
        );
        if (seatIndex !== -1) {
          zoneSeats[seatIndex].status = SEAT_STATUS.SOLD;
        }
      });
    } else {
      booking.status = BOOKING_STATUS.PENDING;
      booking.paymentMethod = PAYMENT_METHODS.CASH;
      booking.contactPhone = phone;
      booking.deliveryAddress = address;
      // Update seats to PENDING
      booking.seats.forEach((seat) => {
        const zoneSeats = mockData.seats[booking.showId][seat.zone];
        const seatIndex = zoneSeats.findIndex(
          (s) => s.row === seat.row && s.col === seat.col
        );
        if (seatIndex !== -1) {
          zoneSeats[seatIndex].status = SEAT_STATUS.PENDING;
        }
      });
    }

    saveMockData();
    return booking;
  },
};

// Initialize on load
mockService.init();
