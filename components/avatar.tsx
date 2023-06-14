import Image from 'next/image';
import { AvatarProps } from '../lib/types';

export default function Avatar({ author }: AvatarProps) {
  const isAuthorHaveFullName = author?.node?.firstName && author?.node?.lastName;
  const name = isAuthorHaveFullName
    ? `${author.node.firstName} ${author.node.lastName}`
    : author.node.name || null;

  return (
    <div>
      <div>{/* <Image src={author.node.avatar.url} layout='fill' alt={name} /> */}</div>
      <div>{name}</div>
    </div>
  );
}
