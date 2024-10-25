<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import moment from 'moment'

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
const clients = ref(null)
const dialogDelete = ref(false)

onMounted(() => {
    getVendas();
    getClientes()
});

const getVendas = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/vendas');
        vendas.value = response.data;
    } catch (error) {
        console.error('Erro coletando vendas: ', error);
    }
};
const getClientes = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/clientes');
        clients.value = response.data;
    } catch (error) {
        console.error('Error fetching clients data: ', error);
    }
};
const openEditDialog = (vendas) => {
    CurrentVendas.value = {
        id: vendas.id,
        total: vendas.total,
        clienteId: vendas.clienteId,
        dataVenda: formatDate(vendas.dataVenda),
    };
    dialogEdit.value = true;
};
const openCriaDialog = (client) => {
    CurrentVendas.value = {
        clienteId: '',
        total: '',
        dataVenda: '',
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
        await axios.post('http://localhost:3000/api/vendas', newVenda);
        await getVendas(); 
        dialogCreate.value = false; 
    } catch (error) {
        console.error('Error creating newVenda: ', error);
    }
};

const editVenda = async () => {
    const isoDate = moment(CurrentVendas.value.dataVenda, 'DD/MM/YYYY').toISOString();
    const vendaToUpdate = {
        ...CurrentVendas.value,
        dataVenda: isoDate,
    };
    try {
        await axios.put(`http://localhost:3000/api/vendas/${CurrentVendas.value.id}`, vendaToUpdate);
        await getVendas(); 
        dialogEdit.value = false; 
    } catch (error) {
        console.error('Error editing CurrentVendas: ', error);
    }
};
const formatDate = (date) => {
    return moment(date).format('DD/MM/YYYY');
};
const maskDate = (value) => {
    const stringValue = String(value);  
    const cleaned = stringValue.replace(/\D/g, ''); 
    const match = cleaned.match(/(\d{0,2})(\d{0,2})(\d{0,4})/);
    if (match) {
        return [match[1], match[2], match[3]].filter(Boolean).join('/');
    }
    return value;
};
const openDeleteDialog = (vendas) => {
    CurrentVendas.value = { ...vendas };
    dialogDelete.value = true;
};
const deleteVenda = async () => {
        try {
            await axios.delete(`http://localhost:3000/api/vendas/${CurrentVendas.value.id}`);
            await getVendas(); 
            dialogDelete.value = false; 
        } catch (error) {
            console.error('Error delete vendas: ', error);
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
                    <td>{{ formatDate(slotProps.item.dataVenda) }}</td>
                    <td>
                        <v-btn @click="openEditDialog(slotProps.item)" color="yellow"><ion-icon name="create-outline"></ion-icon></v-btn>
                    </td>
                    <td>
                        <v-btn @click="openDeleteDialog(slotProps.item)" color="red"><ion-icon name="trash-outline"></ion-icon></v-btn>
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
                        <v-select
                        v-model="CurrentVendas.clienteId"
                        :items="clients"
                        item-title="id"        
                        item-value="id"          
                        label="ID do Cliente"
                        required
                    ></v-select>
                        <v-text-field
                            v-model="CurrentVendas.dataVenda"
                            label="Data da Venda (DD/MM/YYYY)"
                            required
                            :value="maskDate(CurrentVendas.dataVenda)"
                            @input="CurrentVendas.dataVenda = maskDate($event.target.value)"
                        ></v-text-field>
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
                        <v-select
                            v-model="CurrentVendas.clienteId"
                            :items="clients"
                            item-title="id"        
                            item-value="id"          
                            label="ID do Cliente"
                            required
                            disabled
                        ></v-select>
                        <v-text-field
                            v-model="CurrentVendas.dataVenda"
                            label="Data da Venda (DD/MM/YYYY)"
                            required
                            :value="maskDate(CurrentVendas.dataVenda)"
                            @input="CurrentVendas.dataVenda = maskDate($event.target.value)"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialogEdit = false">Cancelar</v-btn>
                        <v-btn @click="editVenda" color="primary">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="600px">
            <template v-slot:default="{ attrs }">
                <v-card>
                    <v-card-title>
                        <span class="headline">Atenção</span>
                    </v-card-title>
                    <v-card-text>
                        Deseja mesmo apagar esta Venda?
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialogDelete = false">Não</v-btn>
                        <v-btn @click="deleteVenda" color="primary">Sim</v-btn>
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
