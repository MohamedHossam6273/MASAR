'use client';

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: URL) => {
  if (!GA_TRACKING_ID) return;
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

type GTagEvent = {
  action: string;
  params: { [key: string]: string | number | undefined };
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, params }: GTagEvent) => {
  if (!GA_TRACKING_ID) return;
  window.gtag('event', action, params);
};
