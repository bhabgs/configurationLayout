import {
  toDisplayString as _toDisplayString,
  createElementVNode as _createElementVNode,
  createTextVNode as _createTextVNode,
  resolveComponent as _resolveComponent,
  withCtx as _withCtx,
  createVNode as _createVNode,
  Fragment as _Fragment,
  openBlock as _openBlock,
  createElementBlock as _createElementBlock,
  pushScopeId as _pushScopeId,
  popScopeId as _popScopeId,
} from "vue";

const _withScopeId = (n) => (
  _pushScopeId("data-v-2m1z7a"), (n = n()), _popScopeId(), n
);
const _hoisted_1 = { class: "aa" };

import { ref } from "vue";

return {
  setup(__props) {
    const msg = ref("Hello World!aaa");

    return (_ctx, _cache) => {
      const _component_a_button = _resolveComponent("a-button");
      const _component_a_input = _resolveComponent("a-input");

      return (
        _openBlock(),
        _createElementBlock(
          _Fragment,
          null,
          [
            _createElementVNode(
              "h1",
              _hoisted_1,
              _toDisplayString(msg.value),
              1 /* TEXT */
            ),
            _createVNode(
              _component_a_button,
              {
                type: "primary",
                danger: "",
              },
              {
                default: _withCtx(() => [_createTextVNode("哈哈")]),
                _: 1 /* STABLE */,
              }
            ),
            _createVNode(
              _component_a_input,
              {
                value: msg.value,
                "onUpdate:value":
                  _cache[0] || (_cache[0] = ($event) => (msg.value = $event)),
              },
              null,
              8 /* PROPS */,
              ["value"]
            ),
          ],
          64 /* STABLE_FRAGMENT */
        )
      );
    };
  },
};
