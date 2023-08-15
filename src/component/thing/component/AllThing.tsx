import { defineComponent, ref, reactive, onMounted, watch } from 'vue';
import useTableList from '../hooks/useTableList';

import * as thingApis from '@/api/thingInstance';

export default defineComponent({
  name: 'AllThing',
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
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
    const queryFormRef = ref();
    const columns = [
      {
        dataIndex: 'NAME',
        title: '实例名称',
        ellipsis: true,
      },
      {
        dataIndex: 'CODE',
        title: '实例编码',
        ellipsis: true,
      },
      // {
      //   dataIndex: 'thingName',
      //   title: '物模型名称',
      // },
      {
        dataIndex: 'THING_CODE',
        title: '物模型编码',
      },
    ];

    const formQuery: any = ref([
      {
        label: '实例名称',
        queryType: 'LIKE',
        propertyCode: 'NAME',
        propertyId: 0,
        value: '',
      },
      // {
      //   label: '实例编码',
      //   column: 'instanceCode',
      //   queryType: 'LIKE',
      //   value: null,
      // },
    ]);

    const getList = async () => {
      const param: any = {
        thingCode: props.thingCode,
        queryPropertyList: formQuery.value,
        thingInstQueryOrder: {},
      };
      const res: any = await thingApis.indInstList({
        ...param,
        pageNum: currPage.value,
        pageSize: pageSize.value,
      });
      const resObj: any = {
        columnData: [],
        data: [],
        totalNum: res.data?.total,
      };
      if (res.data) {
        resObj.data = res.data.list.map((ele: any) => {
          ele.listPropertyList.forEach((prop: any) => {
            ele[prop.thingPropertyCode] = prop.displayValue;
          });
          return ele;
        });
      } else {
        resObj.data = [];
      }
      return resObj;
    };

    const { isLoading, tableList, pagination, refresh, currPage, pageSize } =
      useTableList(getList, 'list', 'total');
    watch(
      () => props.thingCode,
      (nVal) => {
        state.selectedRowKeys = [];
        state.selectedRows = [];
        currPage.value = 1;
        refresh();
      }
    );
    context.expose({
      refresh,
    });

    onMounted(() => {
      refresh();
    });

    const reset = () => {
      formQuery.value.forEach((ele) => {
        ele.value = '';
        ele.queryType = 'LIKE';
      });
      refresh();
    };

    const state = reactive<{
      selectedRowKeys: string[];
      selectedRows: any[];
    }>({
      selectedRowKeys: [],
      selectedRows: [],
    });
    const onSelectChange = (selectedRowKeys: string[], selectedRows: any[]) => {
      state.selectedRowKeys = selectedRowKeys;
      state.selectedRows = selectedRows;
      context.emit(
        'changeSelect',
        state.selectedRows.map((item) => ({
          id: item.thingInstId,
          name: item.NAME,
          code: item.CODE,
          thingCode: item.thingCode,
          thingName: item.thingName,
        }))
      );
    };

    return () => (
      <div class='inl-card-editor-AllThing'>
        <a-form
          ref={queryFormRef}
          model={formQuery.value}
          // labelCol={{ style: { width: "9em" } }}
          wrapperCol={{ span: 16 }}
          onSubmit={refresh}
        >
          <a-row>
            {formQuery.value.map((formItem: any) => (
              <a-col span={16}>
                <a-form-item label={formItem.label}>
                  <div class='flex'>
                    <div class='flex'>
                      <a-select
                        class='searchSelect'
                        v-model={[formItem.queryType, 'value']}
                      >
                        <a-select-option value='LIKE'>{'∈'}</a-select-option>
                        <a-select-option value='EQUAL'>{'='}</a-select-option>
                        <a-select-option value='NOT_EQUAL'>
                          {'≠'}
                        </a-select-option>
                        {/* <a-select-option value="GT">{">"}</a-select-option>
                        <a-select-option value="GTE">{"≥"}</a-select-option>
                        <a-select-option value="LT">{"<"}</a-select-option>
                        <a-select-option value="LTE">{"≤"}</a-select-option> */}
                      </a-select>

                      <a-input
                        v-model={[formItem.value, 'value', ['trim']]}
                        class='searchVal'
                        allowClear={true}
                      />
                    </div>
                  </div>
                </a-form-item>
              </a-col>
            ))}
            <a-col span={8} class='align-r'>
              <a-space size={16}>
                <a-button type='primary' html-type='submit'>
                  查询
                </a-button>
                <a-button onClick={reset}>重置</a-button>
              </a-space>
            </a-col>
          </a-row>
        </a-form>

        <a-table
          rowKey='thingInstId'
          columns={columns}
          dataSource={tableList.value}
          loading={isLoading.value}
          pagination={pagination}
          size='small'
          scroll={{ y: '500px' }}
          row-selection={{
            selectedRowKeys: state.selectedRowKeys,
            onChange: onSelectChange,
            type: props.multiple ? 'checkbox' : 'radio',
          }}
          // v-slots={{
          //   bodyCell: ({ column, record }) => {
          //     if (column.dataIndex) {
          //       return record.thingInst[column.dataIndex];
          //     }
          //   },
          // }}
        ></a-table>
      </div>
    );
  },
});
