export interface Director {
  pkDirector?: number;
  name: string;
  age?: number;
  active: boolean;
  moviesCount?: number;
}

export interface CreateDirectorDto {
  name: string;
  age?: number;
  active: boolean;
}

export interface UpdateDirectorDto {
  name: string;
  age?: number;
  active: boolean;
}