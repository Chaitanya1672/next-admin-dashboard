import {Product, User} from "./models";
import {connectToDB} from '../lib/utils'
export const fetchUsers = async (q,page) =>{
  const regex = new RegExp(q,'i')
  const ITEMS_PER_PAGE = 2
  try {
    await connectToDB()
    const count = await User.find({username: {$regex: regex}}).countDocuments()
    const users = await User.find({username: {$regex: regex}}).limit(ITEMS_PER_PAGE).skip(ITEMS_PER_PAGE * (page - 1))
    return {users, count}
  } catch (error) {
    throw new Error(error)
  }
}
export const fetchUser = async(id)=>{
  try {
    await connectToDB()
    const user = await User.findById(id)
    return user
  } catch (error) {
    throw new Error(error)
  }
}

export const fetchProduct = async(id)=>{
  try {
    await connectToDB()
    const product = await Product.findById(id)
    return product
  } catch (error) {
    throw new Error(error)
  }
}
export const fetchProducts = async (q,page) =>{
  const regex = new RegExp(q,'i')
  const ITEMS_PER_PAGE = 2
  try {
    await connectToDB()
    const count = await Product.find({title: {$regex: regex}}).countDocuments()
    const products = await Product.find({title: {$regex: regex}}).limit(ITEMS_PER_PAGE).skip(ITEMS_PER_PAGE * (page - 1))
    return {products, count}
  } catch (error) {
    throw new Error(error)
  }
}


// DUMMY DATA

export const cards = [
  {
    id: 1,
    title: "Total Users",
    number: 10.928,
    change: 12,
  },
  {
    id: 2,
    title: "Stock",
    number: 8.236,
    change: -2,
  },
  {
    id: 3,
    title: "Revenue",
    number: 6.642,
    change: 18,
  },
];