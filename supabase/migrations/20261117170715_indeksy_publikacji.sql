-- publikacje: indeks pod klucz obcy i pod „ostatnia publikacja”
create index if not exists publikacje_kto_idx on public.publikacje (kto);
create index if not exists publikacje_utworzono_idx on public.publikacje (utworzono desc);
