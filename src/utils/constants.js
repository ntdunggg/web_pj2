export const SEAT_STATUS = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  PENDING: 'pending',
  SELECTED: 'selected',
};

export const USER_ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
};

export const BOOKING_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  REJECTED: 'rejected',
};

export const ZONES = {
  ZONE_A: 'zone_a',
  ZONE_B: 'zone_b',
  LEVEL_2: 'level_2',
};

export const ZONE_CONFIG = {
  [ZONES.ZONE_A]: {
    name: 'Zone A',
    rows: 15,
    cols: 10,
    totalSeats: 150,
  },
  [ZONES.ZONE_B]: {
    name: 'Zone B',
    rows: 15,
    cols: 10,
    totalSeats: 150,
  },
  [ZONES.LEVEL_2]: {
    name: '2nd Floor',
    rows: 10,
    cols: 20,
    totalSeats: 200,
  },
};

export const WEDNESDAY_DISCOUNT = 0.3; // 30% discount
