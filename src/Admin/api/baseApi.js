import axios from 'axios'

const BASE = axios.create({ baseURL: "https://zions.onrender.com/api" })

export const getAllDegree = () => BASE.get('/courseDetail')

export const addNewDegree = (degreeData) => BASE.post('/courseDetail', degreeData)

export const editDegree = (degreeId, courseData) => BASE.put(`/courseDetail/${degreeId}`, courseData)

export const deleteDegree = (degreeId) => BASE.delete(`/courseDetail/${degreeId}`)