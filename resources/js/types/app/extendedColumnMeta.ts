import { ColumnMeta } from "@tanstack/react-table";

export interface ExtendedColumnMeta<TData> extends ColumnMeta<TData, unknown> {
    label?: string;
    className?: string

}

export interface ExtendedColumn {
    label?: string;
    className?: string
}
