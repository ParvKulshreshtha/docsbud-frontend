type ErrorBannerProps = {
  message: string;
};

export function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <p className="text-xs text-danger bg-danger-soft border border-danger/20 rounded-card px-3 py-2">
      {message}
    </p>
  );
}
