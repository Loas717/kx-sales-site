// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../view/Home.vue';
import Clientes from '@/view/Clientes.vue';
import Vendas from '@/view/Vendas.vue';

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/clientes',
        name: 'clientes',
        component: Clientes,
    },
    {
        path: '/vendas',
        name: 'vendas',
        component: Vendas,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
