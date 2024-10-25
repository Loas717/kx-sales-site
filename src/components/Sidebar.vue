    <template>
        <aside class="sidebar">
        <nav>
            <ul>
                <li @click="navigateTo('home')">Home</li>
                <li @click="navigateTo('clientes')">Clientes</li>
                <li @click="navigateTo('vendas')">Vendas</li>
            </ul>
        </nav>
        </aside>
    </template>
    <script>
    import { useRouter } from 'vue-router';
    
    export default {
        setup() {
            const router = useRouter();
        
            const navigateTo = (route) => {
            router.push({ name: route });
        };
            return { navigateTo };
        },
    };
    </script>
    <style scoped>
    .sidebar {
        width: 200px; 
        height: 100vh;
        background-color: #f4f4f4;
        padding: 20px;
        position: relative; 
    }
    
    .sidebar ul {
        list-style-type: none;
        padding: 0;
    }
    
    .sidebar li {
        cursor: pointer;
        margin: 10px 0;
    }
    </style>