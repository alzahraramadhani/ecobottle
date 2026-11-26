-- Seed initial dropbox locations around Universitas Negeri Malang (UM)
insert into public.locations (name, lat, lng, bottles, max_bottles, capacity, status)
values
  ('Belakang Kantin FMIPA', -7.960115457056404, 112.61910943648053, 100, 400, 25, 'low'),
  ('Selasar B12', -7.962518147225951, 112.6176377004253, 180, 400, 45, 'mid'),
  ('Parkiran Selatan Gracak', -7.9598368022568415, 112.61806487610936, 312, 400, 78, 'high'),
  ('Sebelah Kantin FS', -7.96054779475726, 112.61631187145227, 48, 400, 12, 'low'),
  ('Taman Perpustakaan', -7.962622692931228, 112.61637211073985, 220, 400, 55, 'mid'),
  ('Depan Gedung D19', -7.960705370393788, 112.61608056564829, 352, 400, 88, 'high'),
  ('Samping Gedung C6', -7.960544477476524, 112.6169720985663, 132, 400, 33, 'low'),
  ('Depan Gedung D3', -7.961850427885315, 112.61562727201535, 248, 400, 62, 'mid'),
  ('Depan Gedung A20', -7.961107148633123, 112.61949650060367, 60, 400, 15, 'low');
