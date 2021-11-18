import { gql } from 'graphql-request';

export const LabelFieldsFragment = gql`
  fragment LabelFields on Label {
    color
    description
    descriptionHtml
    id
    textColor
    title
  }
`;

export const MRLabelsFragment = gql`
  fragment MRLabels on LabelConnection {
    count
    nodes {
      ...LabelFields
    }
    pageInfo {
      endCursor
      hasNextPage
      hasPreviousPage
      startCursor
    }
  }
  ${LabelFieldsFragment}
`;

export const ProjectFieldsFragment = gql`
  fragment ProjectFields on Project {
    name
    webUrl
    id
  }
`;

export const MRFieldsFragment = gql`
  fragment MRFields on MergeRequest {
    approved
    createdAt
    id
    sourceBranch
    title
    updatedAt
    commitCount
    createdAt
    description
    iid
    labels(first: 5) {
      ...MRLabels
    }
    mergeStatusEnum
    sourceBranch
    state
    targetBranch
    title
    titleHtml
    updatedAt
    webUrl
    descriptionHtml
    project {
      ...ProjectFields
    }
  }
  ${MRLabelsFragment}
  ${ProjectFieldsFragment}
`;

export const GetMRByIid = gql`
  query getProjects($fullPath: ID!, $iids: [String!]) {
    project(fullPath: $fullPath) {
      mergeRequests(iids: $iids) {
        count
        nodes {
          ...MRFields
        }
        pageInfo {
          endCursor
        }
      }
    }
  }
  ${MRFieldsFragment}
`;
