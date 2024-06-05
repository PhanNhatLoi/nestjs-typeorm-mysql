export const API_PREFIX = '/api/v1';
export const SWAGGER_TITLE = 'Go24 Partner Project';
export const SWAGGER_DES = 'Go24 Partner Project API description';
export const DEFAULT_PAGE_LIMIT = 25;

export enum ENVIRONMENT {
  DEVELOP = 'develop',
  STAGING = 'staging',
  PRODUCTION = 'production',
}

export enum ShopType {
  Personal = 1,
  Store = 2,
}

export const ShopCODSettings = {
  EvenDayOfWeek: {
    code: 1,
    description: 'Đối soát 3 lần/ tuần vào thứ 2,4,6',
  },
  MondayOfWeek: {
    code: 2,
    description: 'Đối soát 1 lần/tuần vào thứ 2 hàng tuần',
  },
  SatursdayOfWeek: {
    code: 3,
    description: 'Đối soát 1 lần/tuần vào thứ 7 hàng tuần',
  },
  FirstDayOfMonth: {
    code: 4,
    description: 'Đối soát 1 lần/tháng vào ngày 01 tháng sau',
  },
  TwoTimeOfWeek: {
    code: 5,
    description: 'Đối soát 2 lần/tháng vào ngày 1 và 15 hàng tháng',
  },
};

export enum USER_ROLE {
  ADMIN = 1,
  SHOP = 2,
  PARTNER = 3,
}

export const OrderStatuses = {
  ReimbursementDelivery: {
    code: -3,
    description: 'Đơn hàng bồi hoàn phí vận chuyển',
  },
  Reimbursement: {
    code: -2,
    description: 'Đơn hàng bồi hoàn',
  },
  Canceled: {
    code: -1,
    description: 'Đơn hàng đã bị huỷ',
  },
  WaitingConfirm: {
    code: 0,
    description: 'Đơn hàng chờ xác nhận',
  },
  WaitingTakeOrder: {
    code: 1,
    description: 'Đơn hàng đã xác nhận - chờ lấy hàng',
  },
  Delivering: {
    code: 2,
    description: 'Đang trên xe giao hàng',
  },
  Deliveried: {
    code: 3,
    description: 'Đơn hàng đã giao thành công',
  },
  WaitingReturn: {
    code: 4,
    description: 'Đơn hàng chờ chuyển hoàn',
  },
  Returned: {
    code: 5,
    description: 'Đơn hàng đã chuyển hoàn',
  },
  DeliveryFailed: {
    code: 6,
    description: 'Không giao được hàng',
  },
  Incident: {
    code: 7,
    description: 'Đang khiếu nại đền bù',
  },
  PickedUp: {
    code: 8,
    description: 'Đã lấy hàng/ Nhập kho',
  },
  Transporting: {
    code: 9,
    description: 'Đang trung chuyển',
  },
  Stored: {
    code: 10,
    description: 'Đã nhập kho giao',
  },
  PartiallyReturning: {
    code: 11,
    description: 'GH1P - chờ trả',
  },
  PartiallyDelivered: {
    code: 12,
    description: 'Đã giao hàng 1 phần',
  },
  PartiallyReturned: {
    code: 13,
    description: 'GH1P - đã trả',
  },
  MaskDeliveryFailed: {
    code: 500,
    description: 'Trạng thái không sử dụng',
  },
  MaskDelayDelivery: {
    code: 501,
    description: 'Trạng thái không sử dụng',
  },
  MaskDelayPickup: {
    code: 502,
    description: 'Trạng thái không sử dụng',
  },
  MarkKeepStatus: {
    code: 503,
    description: 'Trạng thái không sử dụng',
  },
  WeightChanged: {
    code: 600,
    description: 'Trạng thái không sử dụng',
  },
};

export const OrderPaidStatuses = {
  None: {
    code: 0,
    description: 'None',
  },
  NotPaid: {
    code: 1,
    description: 'Chưa thu',
  },
  WaitingPaid: {
    code: 2,
    description: 'Chờ đối soát',
  },
  Done: {
    code: 3,
    description: 'Đã đối soát',
  },
};

export const CODStatuses = {
  None: {
    code: 0,
    description: 'Không ứng tiền',
  },
  WaitingCOD: {
    code: 1,
    description: 'Chờ ứng tiền',
  },
  Done: {
    code: 2,
    description: 'Đã ứng tiền',
  },
};

export enum AddedServiceType {
  PartialDelivery = 1,
  FragileItem = 2,
  AgriculturalItem = 3,
  Document = 4,
  SealedProduct = 5,
}

export enum ImplementType {
  Approved = 1,
  Rejected = 2,
  Admin = 3,
  Confirmed = 4,
}
