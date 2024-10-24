<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const vendas = ref([]);
const CurrentVendas = ref(null);
const dialogCreate = ref(false);
const dialogEdit = ref(false);
const headers = ref([
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'Total', key: 'total' },
    { title: 'ID do Cliente', key: 'clienteId' },
    { title: 'Data da Venda', key: 'dataVenda' },
]);

onMounted(() => {
    getVendas();
});

const getVendas = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/vendas');
        vendas.value = response.data;
    } catch (error) {
        console.error('Erro coletando vendas: ', error);
    }
};
const openEditDialog = (client) => {
    CurrentVendas.value = { ...vendas };
    dialogEdit.value = true;
};
const openCriaDialog = (client) => {
    CurrentVendas.value = {
        clienteId: null,
        total: null,
        dataVenda: null,
    };
    dialogCreate.value = true;
};
const createVenda = async () => {
    const newVenda = {
        clienteId: CurrentVendas.clienteId,
        total: CurrentVendas.total,
        dataVenda: CurrentVendas.dataVenda,
    };

    try {
        await axios.post('http://localhost:3000/api/clientes', newVenda);
        await getVendas(); 
        dialogCreate.value = false; 
    } catch (error) {
        console.error('Error creating newVenda: ', error);
    }
};

const editVenda = async () => {
    try {
        await axios.put(`http://localhost:3000/api/clientes/${CurrentVendas.value.id}`, CurrentVendas.value);
        await getClientes(); 
        dialogEdit.value = false; 
    } catch (error) {
        console.error('Error editing CurrentVendas: ', error);
    }
};
</script>

<template>
    <div class="w-full">
        <v-data-table
            :items="vendas"
            :headers="headers"
            item-value="id"
            class="elevation-1"
            :loading="!vendas.length"
            loading-text="Carregando vendas"
            :items-per-page="10"
            :hide-default-footer="true"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Vendas</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="openCriaDialog" color="primary">Criar Venda</v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item="slotProps">
                <tr>
                    <td>{{ slotProps.item.id }}</td>
                    <td>{{ slotProps.item.total }}</td>
                    <td>{{ slotProps.item.clienteId }}</td>
                    <td>{{ slotProps.item.dataVenda }}</td>
                    <td>
                        <v-btn @click="openEditDialog(slotProps.item)" color="yellow">Editar</v-btn>
                </td>
                </tr>
            </template>
        </v-data-table>
        <v-dialog v-model="dialogCreate" max-width="600px">
            <template v-slot:default="{ attrs }">
                <v-card>
                    <v-card-title>
                        <span class="headline">Criar Venda</span>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="CurrentVendas.total" label="Total" required></v-text-field>
                        <v-text-field v-model="CurrentVendas.clienteId" label="ID do Cliente" required></v-text-field>
                        <v-text-field v-model="CurrentVendas.dataVenda" label="Data da Venda" required></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialogCreate = false">Cancelar</v-btn>
                        <v-btn @click="createVenda" color="primary">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>

        <!-- Dialog for editing an existing client -->
        <v-dialog v-model="dialogEdit" max-width="600px">
            <template v-slot:default="{ attrs }">
                <v-card>
                    <v-card-title>
                        <span class="headline">Editar Venda</span>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="CurrentVendas.total" label="Total" required></v-text-field>
                        <v-text-field v-model="CurrentVendas.clienteId" label="ID do Cliente" required></v-text-field>
                        <v-text-field v-model="CurrentVendas.dataVenda" label="Data da Venda" required></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialogEdit = false">Cancelar</v-btn>
                        <v-btn @click="editVenda" color="primary">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
    </div>
</template>

<style scoped>
.w-full {
    padding: 1rem;
}

h1 {
    font-weight: 500;
    font-size: 2.6rem;
    text-align: center;
}

@media (min-width: 1024px) {
    h1 {
        text-align: left;
    }
}
</style>
