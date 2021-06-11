# Linux distribution specific dependencies

## ArchLinux/Garuda Linux

Make sure to have at least one [AUR helper](https://wiki.archlinux.org/title/AUR_helpers) installed.

You can get the AUR helper `aura`, `paru` or any other AUR helper of your liking (see link above).

To build [`franz`](https://aur.archlinux.org/packages/franz/), from the AUR (ArchLinux User Repository) :

```bash
$ sudo aura -Axc franz
```

or

```bash
$ paru -S franz
```

If any issue happens during the build, [comment on the AUR package webpage first](https://aur.archlinux.org/packages/franz/), do not open an issue on GitHub unless you were told to do so explicitly.

You can also install a binary already built of `franz` to avoid having installing any of its dependencies, [`franz-bin`](https://aur.archlinux.org/packages/franz-bin/).

```bash
$ sudo aura -Axc franz-bin
```

or

```bash
$ sudo paru -Axc franz-bin
```

## Debian/Ubuntu
```bash
$ apt install libx11-dev libxext-dev libxss-dev libxkbfile-dev
```

## Fedora
```bash
$ dnf install libX11-devel libXext-devel libXScrnSaver-devel libxkbfile-devel
```
