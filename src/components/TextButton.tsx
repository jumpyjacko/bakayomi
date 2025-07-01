export default function TextButton(props: any) {
    return (
        <div class={props.class}>
        <button onclick={props.action} class={`flex items-center justify-center px-[18px] h-[36px] rounded-[8px] shadow-2 gap-x-[8px] text-nowrap ${props.invert ? 'bg-primary-faded text-primary' : 'bg-primary text-primary-faded'}`}>
        {props.text}
        </button>
        </div>
    );
}
