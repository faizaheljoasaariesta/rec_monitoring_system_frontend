import { useLocation } from 'react-router-dom';
import { menuItems } from '@/constants/menu-item';

export const useIsActiveMenu = () => {
  const location = useLocation();
  const activePath = location.pathname;
  const activeMenu = menuItems.find(item => activePath.startsWith(item.path))?.name ?? '';
  return activeMenu;
};
