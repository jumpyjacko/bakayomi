import i18next from "i18next";

export default function VolumeSeparator(props) {
    return (
        <div class="w-full p-2 my-1 typo-body text-shadow-md flex flex-row items-center">
        <p class="pr-2">
        {props.title === "No Volume" ? i18next.t("series_v:noSpecifiedVolume") : props.title}
        </p>
        <hr class="flex-1" />
        </div>
    );
}
