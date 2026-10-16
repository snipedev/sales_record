import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getData = async () => {
  const res = await api.get('/expenses');
  return res.data;
};

export const putData = async () => {
  const res = await api.get('/expenses');
  return res.data;
};