// All components mapping with path for internal routes

import { lazy } from 'react'

const Status = lazy(() => import('../LandOwner/Stats'))
const AllHouses = lazy(() => import('../LandOwner/AllHouses'))
const Category = lazy(() => import('../Admin/Category'))
const ClientContactUs = lazy(() => import('../Admin/ClientContactUs'))
const HelpCenterAdmin = lazy(() => import('../Admin/HelpCenterAdmin'))
const NewsLetter = lazy(() => import('../Admin/NewsLetter'))
const propertyType = lazy(() => import('../Admin/PropertType'))
const AddHouses = lazy(() => import('../Admin/AddHouse'))
const User = lazy(() => import('../Admin/User'))
const CreateUser = lazy(() => import('../Admin/CreateUser'))
const allPosts = lazy(() => import('../Renting/AllPosts'))



const routes = [
  {
    path: '/analytics',
    component: Status,
  },
  {
    path: '/houses',
    component: AllHouses,
  },
  {
    path: '/createUser',
    component: CreateUser
  },
  {
    path: '/Category',
    component: Category,
  },
  {
    path: '/propertyType',
    component: propertyType,
  },
  {
    path: '/addHouses',
    component: AddHouses,
  },
  {
    path: '/AllHouses',
    component: AllHouses,
  },
  {
    path: '/newsLetter',
    component: NewsLetter,
  },
  {
    path: '/question',
    component: ClientContactUs,
  }, 
  {
    path: '/issues',
    component: HelpCenterAdmin,
  },
  {
    path: '/allPosts',
    component: allPosts,
  },


]

export default routes
