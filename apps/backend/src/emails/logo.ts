/**
 * Símbolo HCLEAN anexado ao e-mail com Content-ID.
 *
 * Vai como anexo inline (cid:) em vez de data URI porque Gmail e Outlook
 * descartam <img src="data:">. O desenho é o mesmo do componente <Logo> do
 * site — anel claro com a onda verde sobre a azul — exportado em PNG 92x92
 * com fundo transparente para assentar sobre o verde do cabeçalho.
 */

const MARK_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAYAAADj79JYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAA' +
  'DsMAAA7DAcdvqGQAAAo/SURBVHhe7V0xbNtGFNXWTkWGDgW6FJ3aKZmKLI2ltEOALOnmzbFkFF4KGOgSdHImd0qQwZYKBPCQ' +
  'IUCXdKo3crLJNAUMeAk6efSoRSK1uXjHT4n89488ShRF0X7AH+Lckbx///5//9+RarVucYtbrBiTyeSbMAzbCdmPZTQaPYr/' +
  'Ph6P7/O+t8gBlDYej/eCIDgOw9ALw/B6DjkPw/AdTUr7+vr6U36fG4swDL8KguBZEARuEAShoLyyBJN3gNXCn6HxgMWFYfh0' +
  'MpmcCIpZugRB8HE8Hu+ORqMv+LM1ClA0rDkMwyFXgqUMaSWkJAzDK6FtrtCKetlIxcOibRUDC5xMJv3YB8Pt8OtJGA6Hdyh4' +
  '7kGR5Mu16wsCA9hvhK8nFpE3cFjucRAEm2VbGyZhPB4/oQnIm/ArTBa/xlpgNBrdo+XOBzUV8uFPq7QsUv5b/ixJCYLgEu14' +
  '39oCbIAPgg3IXTVnhpsi6qg9XywwCKwQ3rc2IPZhHASxg1pZDiY+ayXimW1jSKUgizH5avjGXd6nTsiJNQiqbd5nZYCVSFSP' +
  'aNdaRX9iU9pYILUwGjygIUMcrtpPz4us1Qq6yttXBuLJ2kPRw9bP7xUAcXoxHiGYVr5qsbz4g5C8q3VkLwiTUSFv4G2XBgQQ' +
  'gxs54G2bACRk0ngrSZLIv0lB5Slv2yRQIqcpHeyGty0NxLOlYNJIy+aApQtjh/EtJ14Zgsg73q7JkLJoJEelxy3pRrD2yqN1' +
  'DSAZHpgLbzc34L/4DajytpylVHPAminlT+mktCDK9xYRPNY1qSkLBvJwtfCKp3LmcmZyzSHpBjtavF0hCKxk8VlsELg/x+qf' +
  'exOFtqr4DG7ydjcZhvj2krfLBXFuviV1ztvdQll5agcJVl74OAbtrqdmbtHNg4f9D9+1B96v7b73Z7vv/dfu+xftvv+mM/AP' +
  '24enj3n7dQFciJCF2ucnRHtSF1iEZ24cnf3YGXh/RUo2S6fvfegc+T/z/usA2qROGSjcDW8nQqoEWndO4Iejf76eWbO9YHIe' +
  'HHrf8uvVGbBy7oKta+ecdxdaHoSH/fc/wWK5Mu3Fv1g3NyOUcoe5jI5Oqqasu6jv7gy857oC55PO4OwXfv26gpKhlO5yWZ1Q' +
  'M7Hm3d+98j/rDLzXXGkpBcJPY0IOTx8/OPK/bw/839p9z+HtkrLRP/ud36uu4CcAcmMfT3Rs/RApOyMw+hewVrTjfQEEy4i1' +
  '8H6RgMk8evX3J7xf3UCb0EkLD3mbKeiwZYqd2LgTKAL0jispIScIoLwfBwJltrX7bzb++Pdz3q9OkNyKkXDQwclU47w6L5Sd' +
  '5UaKWmaeW4JLgivi/eoEHJVjRivXnoQom5lZ5ikb/pn3sYFaMYP3L7TrJRU/8J4XmcgqQW9vJPUoszxeiMmqCeQpuwx2gWDJ' +
  'r8vkBNkr77dq8DwGtXPeRoEX1U0njUpRtrtzr+X22jPZEmsPUTDV75GSwfsXdfLtdBItabi6a6ZiVaqRtMmQx0aw1HmfKdzu' +
  'k5bTPWk5vWHL7V1r4nTPW253t+Vupcqbnb5/t933Tvm90uJfYHKqcDOgtIhNEcX1DzkhoENE2bqUyozarOBmEW8WBpzBlyNF' +
  'n2sKNomakO1UIR8TbeFiIA5qN8m+ZQAriApv0sRrXJun+Zq34PwRHVINCCauLCrb3brTcnrHmkJtxel9VK4nAWVdFiUDuDxu' +
  'efMAq8tmoh/2z75M9hPi4X7y/zWFmxy9VIwS3QgUpRQmKLKIOL2w5XZTh4xg7VkrjT3b66I0Eta8ceRtSmOVxb/grkxgKumz' +
  'O4LC3VQDAmZ85sP9i/bR2RZvE7kQKEpQ4Lzi9DTGBAvOCt5MThDMo6Kafzd5HVinqtUfnW1lxSdZ/AtcM3k9gCtcO4vIObhJ' +
  '4THUUpOYAXwvV5YkmBCn60bSu9T+XxKn967lbml1Hfhsg29dpjgI0qIOhJrUwgoX4fb2NSVxUcpNuwjq21bK5+25qOCbZjFA' +
  '5GZUUOOKKVWwomyCsqDPkhVuY9lwC4KFpoDJMNHG2XWuWm5PPERZ0M1YCgpv3vMiQVjQZ1rhQnZkr3AoiSslrSAEvtwi2BRI' +
  'gmwCbuRiNGsH4JejurzMqvIFSvYP4Z9NFc4s2PhwTgsz6yhT5Cv7ilM7KyhK2T3RrsdFrQbBRRGUq4mCIZT/JmcCTlQN5/D0' +
  'MWcdRcEVrpW5ucJR8Uo1kJCv7MuWu7XY+UOn19euK4mydruJRaADK4llGfun/OiExsPptblkg+vMnZ4qlB3D3d7Trm+SAopf' +
  'CHB7GTUgvpGjlWhp1zmlcGPhPC9AqmVe8qAVi7Hw69NnUO6o3Hcr4eZQ63G6HhuvtivGN3LENyX4aVBxAzSaWX2As5uXr+wY' +
  'YDjOzoF2zyyJqOZiio+C+HF2MjcjBdJGvHjeUPhgTNrvAG53U79ZPLglKjsJd+d+IWuPnu0ymizZBWhQ5ePtZ9ZFt0QmLJyq' +
  'HaYvThBOD+k7FRgsv1l0w2qUHQPWjkQrj7NLAiVGlo9EjUS5SVwPlgyer/fLlO2pj+Z6NFJs65nhGaEKkBUqOwnlV+dUfFmi' +
  'VtssoeMBU/QUgPWOs7IuxRxgGXtq0KuGUjxcwDzWOafgXpGbmo7fsPlgTvr4jvPCJ/qrRmwMy1S803trKi0IXkLcyJmCZ0im' +
  'unjtoRQPClcwuJpkZs0620hASHiyM3YpAdL249YNitbtHFiXgadKRnCFknesxi8dpLLyEHw/Luu4xFpCZYiK3iZYSlK6T/Is' +
  'WQIvj0BE/s0hFM/nf1HoBoGzk9yDnDGkTKlxVl4yJOvOZCccfNeZfFM5xaiGoZQX0GDlPACImectxNcrC1l3DJ6iQsRE6AaD' +
  'qqz8FfBi1h1Deh3OOhDcEEhGuRCN5oyFLlh8uTQQkkEu7HalgID0PzNdvQEgvfC3/cpxuVJQQMkxcwuu4eAlENJJOV96y/jW' +
  '1Y3k5pIBwguUmhxS6ZZzTf0YbsMhfUKQ/r3YNp4E+hJxNTerIQxfAVqu0Rk+Jdf471+t1K1KVLF2n3wuEaaP/1ZKHHithR4A' +
  'Hx9b3vJaAejdVc2NVE6NqdiufUoOgnN0lc38EgHj4TGLZFj4iz9lgD5kI37OH3+v1AJKBIyFftZGGtdlKcnNIpDqCfHDLVRX' +
  'WAGoGKVlkLUzoowv5asMrNSkYAmg4w0HpjHU0k3SG7hackRKx0AOamMhBCiRMkctMMbPXWsiQEtSo1AJwW9D7NXBWuhD7Klz' +
  'OPxZ14LqUpKAd1xEq4GQf9+t2uKJXSF5yzIKyNu6u0ENZO1iQOWDQ419mVaP8zZU4TMaAQSBceUsZFFQpqYlSgZRPzQKBc3L' +
  'dWmi1U/5mmirILD4+ruPIsj7Ga4M8RI/92iSl7i2iWWYBK5NfPGgSaDjdPwMXqVCE298+62RwNKn90PzAlgpQqUIrIZGVzat' +
  'gIBJlq/8blHXYBDEA7ia0n8YtZGgYDv9HXuwDJoM/pvIcE+qDdjOvMH2Fg3E/5KYtc837QK+AAAAAElFTkSuQmCC';

export const logoAttachment = {
  filename: 'hclean.png',
  cid: 'hclean-mark',
  content: Buffer.from(MARK_PNG_BASE64, 'base64'),
  contentType: 'image/png',
};