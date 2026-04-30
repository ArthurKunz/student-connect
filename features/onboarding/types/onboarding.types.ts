export type PersonalDataObject = {
  firstname: string,
  surname: string,
  birthday: string,
  gender: string,
  relationship: string
}

export type SocialDataObject = {
  instagram: string,
  tiktok: string,
  snapchat: string
}

export type SchoolDataObject = {
  gradelevel: string,
  averagemark: string,
  school: string
}

export interface PersonalDataProps {
  onSuccess: (data: PersonalDataObject) => void
}

export interface HobbiesDataProps {
  onSuccess: (data: string[]) => void
  onGoBack: () => void
}

export interface SocialsDataProps {
  onSuccess: (data: SocialDataObject) => void
  onGoBack: () => void
}

export interface SchoolDataProps {
  onSuccess: (data: SchoolDataObject) => void
  onGoBack: () => void
}