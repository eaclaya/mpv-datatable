import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/themes/tailwind-light/theme.css';
import 'primereact/resources/primereact.min.css';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

import { locale, addLocale } from 'primereact/api';

addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar',
    apply: 'Aplicar',
    matchAll: 'Igual',
    matchAny: 'Cualquier',
    startsWith: 'Inicia con',
    contains: 'Contiene',
    notContains: 'No contiene',
    equals: 'Igual',
    notEquals: 'Distinto',
    endsWith: 'Termina',
    addRule: 'Agregar condicion',
});

locale('es');

const ProductTable = () => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        notes: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        qty: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        wholesale_price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    });

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        console.log(value);
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://celltech.miposvirtual.com/apirest/products');
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                    setLoading(false);
                } else {
                    console.error('Failed to fetch data from the API');
                }
            } catch (error) {
                console.error('An error occurred:', error);
            }
        };

        fetchData();
    }, []);

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            notes: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            qty: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
            wholesale_price: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });

        setGlobalFilterValue('');
    };

    const clearFilter = () => {
        initFilters();
    };

    return (
        <div className="w-full">
            <h1>Listado de productos</h1>
            {/* <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Limpiar" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar" />
                </span>
            </div> */}
            <DataTable value={products} loading={loading} paginator showGridlines rows={10} dataKey="id" filterDisplay="menu" className="w-full">
                <Column sortable field="notes" header="Producto" style={{ minWidth: '12rem' }} filter filterMatchMode={FilterMatchMode.STARTS_WITH}>
                    <input type="text" className="p-column-filter" placeholder="Search by name" />
                </Column>
                <Column sortable field="qty" header="Cantidad" style={{ minWidth: '10rem' }} filter filterMatchMode={FilterMatchMode.EQUALS}>
                    <input type="text" />
                </Column>
                <Column sortable field="price" header="Precio Detalle" style={{ minWidth: '10rem' }} filter>
                    <input type="text" />
                </Column>
                <Column sortable field="wholesale_price" header="Precio Mayorista" style={{ minWidth: '10rem' }} filter>
                    <input type="text" />
                </Column>
            </DataTable>
        </div>
    );
};

export default ProductTable;
