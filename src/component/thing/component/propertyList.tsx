import { defineComponent, ref, reactive, watch } from 'vue';
import _ from 'lodash';

import * as thingApis from '@/api/thingInstance';

const columns = [
  {
    dataIndex: 'name',
    title: '名称',
    width:'40%'
  },
  {
    dataIndex: 'code',
    title: '编码',
    width:'40%'
  },
];

export default defineComponent({
  name: 'thingModelProps',
  props: {
    thingCode: {
      type: String,
      default: '',
    },
    thingNode: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['changeSelect'],

  setup(props, context) {
    const getList = async () => {
      const res: any = await thingApis.findPropByCode(props.thingCode);
      state.tableList = []
      if (res?.data) {
        res.data.forEach(item => {
          state.tableList = state.tableList.concat(item.properties)
        });
      }
    };

    const state = reactive<{
      selectedRowKeys: string[];
      selectedRows: any[];
      tableList: any[];
    }>({
      selectedRowKeys: [],
      selectedRows: [],
      tableList: [],
    });
    const onSelectChange = (selectedRowKeys: string[], selectedRows: any[]) => {
      state.selectedRowKeys = selectedRowKeys;
      state.selectedRows = selectedRows;
      context.emit('changeSelect', selectedRows);
    };

    watch(
      () => props.thingCode,
      (nVal) => {
        state.selectedRowKeys = [];
        state.selectedRows = [];
        if (nVal) {
          getList();
        } else {
          state.tableList = [];
        }
      },
      { immediate: true }
    );

    return () => (
      <div class='inl-card-editor-propsList'>
        <p>{props.thingNode.name}的属性</p>
        <a-table
          size='small'
          rowKey='code'
          columns={columns}
          dataSource={state.tableList}
          pagination={false}
          row-selection={{
            selectedRowKeys: state.selectedRowKeys,
            onChange: onSelectChange,
          }}
        ></a-table>
      </div>
    );
  },
});
