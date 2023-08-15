import { ColumnsType } from 'ant-design-vue/lib/table';

export const columns: ColumnsType = [
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '编号',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '创建人',
    dataIndex: 'createUser',
    key: 'createUser',
  },
  {
    title: '创建时间',
    dataIndex: 'createDt',
    key: 'createDt',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    slots: { customRender: 'action' },
  },
];

export const queryOpts = [
  {
    name: '厂家',
    prop: 'catalogCode',
    type: '',
  },
  {
    name: '品牌',
    prop: 'brandCode',
    type: '',
  },
  {
    name: '型号',
    prop: 'modelCode',
    type: '',
  },
  {
    name: '名称',
    prop: 'name',
    type: '',
  },
  {
    name: '编码',
    prop: 'code',
    type: '',
  },
  {
    name: '所属类目',
    prop: 'catalogCode',
    type: '',
  },
];
