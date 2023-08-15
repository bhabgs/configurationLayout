interface videoInfo {
    [key: string]: string | number | boolean | videoInfo | Array<videoInfo>;
}
interface PlayVideoArgs {
    videoElm: string;
    videoDom?: Document;
    mediaServerAddr: string;
    cameraUserName: string;
    cameraPwd: string;
    cameraIp: string;
    cameraRtspPort: string;
    cameraChannel: string;
    cameraStream: string;
    addRtspProxyUrl: string;
}
interface EndpointConfig {
    debug: boolean;
    simulcast: boolean;
    useCamera: boolean;
    audioEnable: boolean;
    videoEnable: boolean;
    recvOnly: boolean;
}
interface WebRtc {
    el?: HTMLElement;
    w?: number;
    h?: number;
    autoPlay?: boolean;
    plays: PlayVideoArgs | Array<PlayVideoArgs>;
    endpointConfig?: EndpointConfig;
}
declare const playOneWebRtcMt: (uuid: string, domId: string, dom?: Document, token?: string) => Promise<any>;
declare class WebRtcMt {
    constructor(opt: WebRtc);
    private dom;
    p_player: any;
    protected playerMap: Map<any, any>;
    protected streamMap: Map<any, any>;
    protected mediaServerAddrMap: Map<any, any>;
    protected config: {
        w: number;
        h: number;
        endpointConfig: {};
    };
    protected createRtspUrl(plays: any): {
        stream: string;
        addRtspProxyUrl: any;
        sdpUrl: any;
    };
    protected init(opt: WebRtc): void;
    protected createVideo(plays: PlayVideoArgs): Promise<unknown>;
    log(type: "err" | "info" | "warn", text: string): void;
    stopPlay(id?: string): void;
    protected playEvent(player: any, videoElm: string, sdpUrl: string): void;
    protected rePlay(videoElm: string): void;
    protected play(videoElm: string): void;
    startPlay(plays: PlayVideoArgs): void;
}

declare const findAlarmDeviceById: (ic: string, token?: string) => Promise<any>;
declare const getDeviceList: (param: {
    iu: string;
    pc: string;
}[], token?: string) => Promise<Record<string, any>[]>;

/**
 * pointCode 参数结构
 */
type POINTCODE = {
    pointCode: string | null;
    value: string | null;
};
type detailGroupList = {
    /**
     * 设备详情组名称
     */
    groupName: string;
    /**
     * 设备详情组类型
     */
    groupType: string;
    /**
     * 设备详情组属性列表
     */
    thingPropertyValueVoList: Array<{
        alarmAvailable: Boolean;
        alarmId: string;
        colorTrans: string;
        colspan: number;
        displayType: string;
        displayValue: string;
        eventEnable: Boolean;
        /**
         * 属性label名称
         */
        label: string;
        /**
         * 属性长度
         */
        linkUrl: null;
        /**
         * 属性长度
         */
        listInfo: "";
        /**
         * 属性类型
         */
        listType: "";
        /**
         * 是否需要报警
         */
        needColorTrans: Boolean;
        /**
         * 是否需要跳转
         */
        needLink: Boolean;
        pointCode: null;
        pointCode2: null;
        /**
         * 属性类型
         */
        propertyType: string;
        /**
         * 刷新频率
         */
        refresh: null;
        /**
         * 关联属性code
         */
        relationThingCode: null;
        /**
         * 是否必填
         */
        selectRequest: Boolean;
        /**
         * 属性排序
         */
        sort: number;
        /**
         * 属性code
         */
        thingPropertyCode: string;
        /**
         * 属性id
         */
        thingPropertyId: string;
        /**
         * 属性实例id
         */
        thingPropertyInstId: null;
        /**
         * 属性名称
         */
        thingPropertyName: string;
        /**
         * 属性单位
         */
        unit: null;
        /**
         * 属性值
         */
        value: string | null;
    }>;
};
type InsTance = {
    /**
     * 设备详情组
     */
    detailGroupList: Array<detailGroupList>;
    functionCode: "WEB";
    listPropertyList: any;
    /**
     * 物模型Code
     */
    thingCode: string;
    thingInstId: string;
    thingInstName: string;
    thingInstPhoto: string;
    thingName: string;
    /**
     * 设备实例
     */
    thingInstEntity: {
        catalogCode: string | null;
        code: string;
        createTime: string;
        createUser: string | null;
        id: string;
        name: string;
        photo: string;
        thingCode: string;
        updateTime: string;
        updateUser: string;
    };
};
interface RequestParams {
    token?: string;
    requestType?: string | null;
    thingCode?: string | null;
    functionCode: "web" | "topo";
}
declare const filterDataByEventEnable: (data: InsTance) => InsTance;
declare const GetDeviceDetailOnce: (codes: Array<string>, params: RequestParams) => Promise<Record<string, InsTance | null>>;
declare const RefreshDeviceDetail: (codes: Record<string, InsTance | null>, token?: string) => Promise<Record<string, InsTance | null>>;
/**
 * @abstract 批量获取设备详情
 * @param codes 设备code数组
 * @param token token 可不传
 * @returns  Promise<Record<string, POINTCODE> | Record<string, InsTance | null>>>
 */
declare const InjectDeviceCodeGetDetail: (codes: Array<string>, params: RequestParams) => Promise<(pcs?: Array<string>) => Promise<Record<string, InsTance | null> | Record<string, POINTCODE>>>;
/**
 *
 * @param deviceCode 设备code数组
 * @param token
 */
declare const InjectDeviceCodeGetState: (deviceCode: Array<string>, params: RequestParams) => Promise<() => Promise<Record<string, POINTCODE | null>>>;
declare const InjectDeveiceCodeGetDetailByPc: (deviceCode: Array<string>, params: RequestParams) => Promise<(pcs: Array<string>) => Promise<{}>>;
type getCorrelationIntsParams = {
    /**
     * 默认值 ‘’
     */
    thingInstCode: string;
    /**
     * 默认值 ‘’
     */
    thingInstName: string;
    /**
     * 默认值1
     */
    pageNum: number;
    /**
     * 默认值100
     */
    pageSize: number;
    /**
     * [thingPropertyValueVoList].relationThingCode
     */
    relaThingCode: string;
    /**
     * InsTance.thingCode
     */
    thingCode: string;
    /**
     * InsTance.thingInstId
     */
    thingInstId: string;
    /**
     * [thingPropertyValueVoList].value
     */
    thingRelationId: string;
};
declare const getCorrelationInts: (d: InsTance, code: "CAMERA" | "DEVICE_MT") => getCorrelationIntsParams;
declare const findRelationEntitiesPage: (data: InsTance, code: "CAMERA" | "DEVICE_MT", params: Pick<RequestParams, "functionCode" | "token">) => Promise<{
    deviceCodeList: string[];
    resData: any;
}>;

interface ICamera {
    cameraId: string;
    cameraCode: string;
}
type GetCameraConfig = {
    token?: string;
    delay?: number;
    onChange?: (cameraList: ICamera[], alarmList: any[]) => void;
    onPolling?: (cameraList: ICamera[], alarmList: any[]) => void;
};
declare function getAlarmingCamera(config: GetCameraConfig): () => void;

export { EndpointConfig, GetDeviceDetailOnce, InjectDeveiceCodeGetDetailByPc, InjectDeviceCodeGetDetail, InjectDeviceCodeGetState, PlayVideoArgs, RefreshDeviceDetail, WebRtc, WebRtcMt, filterDataByEventEnable, findAlarmDeviceById, findRelationEntitiesPage, getAlarmingCamera, getCorrelationInts, getDeviceList, playOneWebRtcMt, videoInfo };
