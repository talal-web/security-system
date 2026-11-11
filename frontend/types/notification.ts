export type NotificationType = "invoice.issued" | "invoice.paid";

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  href: string;
  refModel: string;
  refId: string;
  createdAt: string;
  isRead: boolean;
}

export interface NotificationsResponse {
  success: boolean;
  items: AppNotification[];
  unreadCount: number;
}
