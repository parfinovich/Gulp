import replace from "gulp-replace";
import plumber from "gulp-plumber";
import browserSync from "browser-sync";
import newer from "gulp-newer";
import ifPlugin from "gulp-if";

export const plugins = {
    replace: replace,
    plumber: plumber,
    browserSync: browserSync,
    newer: newer,
    if: ifPlugin
};
