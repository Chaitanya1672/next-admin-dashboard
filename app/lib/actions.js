'use server'
import { revalidatePath } from "next/cache";
import { Product, User } from "./models";
import { connectToDB } from "./utils";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import {signIn} from "../auth";
export const addUser = async (formData) =>{
  const { username, email, password, phone, address, isAdmin, isActive } = Object.fromEntries(formData);
  
  try {
    await connectToDB()
    const salt = await bcrypt.genSalt(10) 
    const hashedPass = await bcrypt.hash(password, salt)
    
    const newUser = new User({
      username, email, password: hashedPass, phone, address, isAdmin, isActive
    })
    await newUser.save()
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create user!");
  }
  revalidatePath('/dashboard/users')
  redirect('/dashboard/users')
}

export const updateUser = async(id, formData) =>{
  // const {username, email, password, phone, address, isAdmin, isActive} = Object.fromEntries(formData)
  const updatedData = {}
  for (const [key, value] of formData.entries()) {
    if (value !== null && value !== undefined && value !== '') {
      if(key === 'password'){
        const salt = await bcrypt.genSalt(10) 
        const hashedPass = await bcrypt.hash(value, salt)
        updatedData[key] = hashedPass;
      }else{
        updatedData[key] = value;
      }
    }
  }
  try {
    await connectToDB()
    await User.findByIdAndUpdate(id,updatedData, {new: true})
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update user!");
  }
  revalidatePath(`/dashboard/users`)
  redirect(`/dashboard/users` )
}

export const deleteUser = async(formData) => {
  const {id} = Object.fromEntries(formData)
  try {
    connectToDB()
    await User.findByIdAndDelete(id)
  } catch (error) {
    throw new Error("Failed to delete user!");
  }
  revalidatePath('/dashboard/users')
}

export const updateProduct = async(formData) =>{
  // const {username, email, password, phone, address, isAdmin, isActive} = Object.fromEntries(formData)
  const updatedData = {}
  let id;
  for (const [key, value] of formData.entries()) {
    if (value !== null && value !== undefined && value !== '') {
      if(key === 'id') id = value
      updatedData[key] = value;
    }
  }
  try {
    await connectToDB()
    await Product.findByIdAndUpdate(id, updatedData, {new: true})
  } catch (error) {
    console.log(error);
    throw new Error("Failed to update user!");
  }
  revalidatePath(`/dashboard/products`)
  redirect(`/dashboard/products` )
}

export const addProduct = async(formData) =>{
  const { title, desc, price, stock, color, size } = Object.fromEntries(formData);
  try {
    await connectToDB()
    const newProduct = new Product({
      title, desc, price, stock, color, size
    })
    await newProduct.save()
  } catch (error) {
    console.log(error);
    throw new Error("Failed to create Product!");
  }
  revalidatePath('/dashboard/products')
  redirect('/dashboard/products')
}

export const deleteProduct = async(formData) => {
  const {id} = Object.fromEntries(formData)
  try {
    connectToDB()
    await Product.findByIdAndDelete(id)
  } catch (error) {
    throw new Error("Failed to delete user!");
  }
  revalidatePath('/dashboard/products')
}

export const authenticate = async (prevState, formData) => {
  const { username, password } = Object.fromEntries(formData);

  try {
    await signIn("credentials", { username, password });
  } catch (err) {
    return  'Wrong Credentials!'
  }
};