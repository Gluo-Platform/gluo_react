export type User = {
  id: string;
  username: string;
  avatar: string | null;
  permissions: number;
  status: string;
  banner: {
    type: string;
    value: string;
  };
  about: string;
  private: boolean;
  creation_timestamp: number;
  streak: number;
  email_address: string;
  invisible: boolean;
  feeds: { id: string; name: string; type: string; icon: string }[];
};
