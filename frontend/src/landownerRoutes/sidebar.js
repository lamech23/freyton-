/** Icons are imported separatly to reduce build time */

import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import WalletIcon from '@heroicons/react/24/outline/WalletIcon'
import UserIcon from '@heroicons/react/24/outline/UserIcon'
import Cog6ToothIcon from '@heroicons/react/24/outline/Cog6ToothIcon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'
import UsersIcon from '@heroicons/react/24/outline/UsersIcon'
import ChartBarIcon from '@heroicons/react/24/outline/ChartBarIcon'
import HomeIcon from '@heroicons/react/24/outline/HomeIcon'
import { isAdmin } from '../utils/Decoded'


const iconClasses = `h-6 w-6`
const submenuIconClasses = `h-5 w-5`
const  admin = isAdmin()

const routes = [
  {
    path: '/landowner/analytics',
    icon: <ChartBarIcon className={iconClasses}/>, 
    name: 'Analytics',
  },
  {
    path: '/landowner/allHouses',
    icon: <HomeIcon className={iconClasses}/>, 
    name: 'AllHouses',
  },  
]



export default routes


