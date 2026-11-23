import { useAsyncData } from './useAsyncData';
import { getFeaturedPartners } from '../services/partnersService';

// If the request fails the footer simply has no partners band.
export const useFeaturedPartners = () => {
  const { data } = useAsyncData('featured-partners', (signal) => getFeaturedPartners({ signal }));
  return data ?? [];
};
