- resolution and density switching

w = width descriptor (image width in pixel)
vw = approximate image width in viewport unit for different breakpoints
300px = default size displayed (box width) outside breakpoints

```sh
  <img
    srcset="img/nat-1.jpg 300w, img/nat-1-large.jpg 1000w"
    sizes="(max-width:900px) 20vw, (max-width:600px) 30vw, 300px"
    alt="Photo 1"
    class="composition__photo composition__photo--p1"
    src="img/nat-1-large.jpg"
  />

```

- art direction - it serves different images depending on the media query
- density switching - is serves the same image with different resolution

```sh

<picture class="footer__logo">
  <source
    srcset="img/logo-green-small-1x.png 1x, img/logo-green-small-2x.png 2x"
    media="(max-width: 37.5em)"
  />

  <img
    srcset="img/logo-green-1x.png 1x, img/logo-green-2x.png 2x"
    alt="Full logo"
    class="footer__logo"
    src="img/logo-green-2x.png"
  />
</picture>

```
