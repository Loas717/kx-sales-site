<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const clients = ref([]);
const headers = ref([
    { title: 'ID', key: 'id', align: 'start' },
    { title: 'Nome', key: 'nome' },
    { title: 'Email', key: 'email' },
    { title: 'Telefone', key: 'telefone' },
    { title: 'Endereço', key: 'endereco' },
    { title: 'CPF', key: 'cpf' },

]);

const dialogCreate = ref(false);
const dialogEdit = ref(false);
const currentClient = ref(null); 

onMounted(() => {
    getClientes();
});

const getClientes = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/clientes');
        clients.value = response.data;
    } catch (error) {
        console.error('Error fetching clients data: ', error);
    }
};


const createClient = async () => {
    const newClient = {
        nome: currentClient.value.nome,
        email: currentClient.value.email,
        telefone: currentClient.value.telefone,
        endereco: currentClient.value.endereco,
        cpf: currentClient.value.cpf,
    };

    try {
        await axios.post('http://localhost:3000/api/clientes', newClient);
        await getClientes(); 
        dialogCreate.value = false; 
    } catch (error) {
        console.error('Error creating client: ', error);
    }
};

const editClient = async () => {
    try {
        await axios.put(`http://localhost:3000/api/clientes/${currentClient.value.id}`, currentClient.value);
        await getClientes(); 
        dialogEdit.value = false; 
    } catch (error) {
        console.error('Error editing client: ', error);
    }
};

const openEditDialog = (client) => {
    currentClient.value = { ...client };
    dialogEdit.value = true;
};
const openCriaDialog = (client) => {
    currentClient.value = {
        nome: "",
        email: "",
        telefone: "",
        endereco: "",
        cpf: "",
    };
    dialogCreate.value = true;
};
const formatCpf = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 11) {
        value = value.slice(0, 11);
    }
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
    }
    if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d)/, '$1.$2.$3');
    }
    if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{2})$/, '$1-$2');
    }
    currentClient.value.cpf = value;
};

</script>

<template>
    <div class="w-full">
        <v-data-table
            :items="clients"
            :headers="headers"
            item-value="id"
            class="elevation-1"
            :loading="!clients.length"
            loading-text="Carregando Clientes"
            :items-per-page="10"
            :hide-default-footer="true"
        >
            <template v-slot:top>
                <v-toolbar flat>
                    <v-toolbar-title>Clientes</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn @click="openCriaDialog" color="primary">Criar Cliente</v-btn>
                </v-toolbar>
            </template>

            <template v-slot:item="slotProps">
                <tr>
                    <td>{{ slotProps.item.id }}</td>
                    <td>{{ slotProps.item.nome }}</td>
                    <td>{{ slotProps.item.email }}</td>
                    <td>{{ slotProps.item.telefone }}</td>
                    <td>{{ slotProps.item.endereco }}</td>
                    <td>{{ slotProps.item.cpf }}</td>
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
                        <span class="headline">Criar Cliente</span>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="currentClient.nome" label="Nome" required></v-text-field>
                        <v-text-field v-model="currentClient.email" label="Email" required></v-text-field>
                        <v-text-field v-model="currentClient.telefone" label="Telefone" required></v-text-field>
                        <v-text-field v-model="currentClient.endereco" label="Endereço" required></v-text-field>
                        <v-text-field
                            v-model="currentClient.cpf"
                            label="CPF"
                            required
                            maxlength="14"
                            placeholder="000.000.000-00"
                            @input="formatCpf()"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialogCreate = false">Cancelar</v-btn>
                        <v-btn @click="createClient" color="primary">Salvar</v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>

        <!-- Dialog for editing an existing client -->
        <v-dialog v-model="dialogEdit" max-width="600px">
            <template v-slot:default="{ attrs }">
                <v-card>
                    <v-card-title>
                        <span class="headline">Editar Cliente</span>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field v-model="currentClient.nome" label="Nome" required></v-text-field>
                        <v-text-field v-model="currentClient.email" label="Email" required></v-text-field>
                        <v-text-field v-model="currentClient.telefone" label="Telefone" required></v-text-field>
                        <v-text-field v-model="currentClient.endereco" label="Endereço" required></v-text-field>
                        <v-text-field
                            v-model="currentClient.cpf"
                            label="CPF"
                            required
                            maxlength="14"
                            placeholder="000.000.000-00"
                            @input="formatCpf()"
                        ></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn @click="dialogEdit = false">Cancelar</v-btn>
                        <v-btn @click="editClient" color="primary">Salvar</v-btn>
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
