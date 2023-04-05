import { createVNode, render } from 'vue';
import dialog from './dialog.vue';

export default {
    methods: {
        confirm: async function (props) {
            // bodyの末尾にタグを追加し、そのタグの中にVue要素を追記する
            const container = document.createElement("div");
            document.body.appendChild(container);
            // 兄弟要素であれば後の要素の方が前面に出るため、
            // container要素を最前面に配置し、
            // container要素を画面全体に表示し、
            // container以外の要素に触れないようにする。
            // z-indexの最大値は現状 2147483638（32bit）らしいが、最大値以上を入れても最大値として扱う文化らしい
            //  → https://1-notes.com/css-z-index-max-value/
            container.style.position = "absolute";
            container.style.zIndex = 2 ** 63;
            // 画面全体に表示
            container.style.width = "100vw";
            container.style.height = "100vh";
            container.style.top = "0px";
            container.style.left = "0px";
            return new Promise((resolve) => {
                props.destroy = (val) => {
                    render(null, container);
                    vnode = undefined;
                    container.remove();
                    resolve(val);
                };
                let vnode = createVNode(dialog, props);
                vnode.appContext = { ...(this.$.appContext) };
                render(vnode, container);
                // vnodeがキャンセルして閉じられるのであれば、バックグラウンドをクリック時にダイアログクローズを提案
                if (vnode.component.ctx.isCancelable) {
                    container.addEventListener('click', () => {
                        if (window.confirm('選択を破棄してダイアログを閉じますか？')) {
                            render(null, container);
                            vnode = undefined;
                            container.remove();
                            resolve(undefined);
                        }
                    });
                }
            });
        }
    }
}
